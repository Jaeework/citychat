import { CityRepository } from "@/backend/domain/repositories/CityRepository";
import { City } from "@/backend/domain/entities/City";
import { SupabaseClient } from "@supabase/supabase-js";

interface ImageRecord {
  storage_path: string;
  public_url?: string;
}
interface CityTable {
  id: number;
  name: string;
  description: string;
  image_id: number;
  images?: ImageRecord | null;
}

export class SbCityRepository implements CityRepository {
  constructor(private supabase: SupabaseClient) { }

  private mapToCity(cityTable: CityTable): City {
    return new City(
      cityTable.id,
      cityTable.name,
      cityTable.description,
      this.getImageUrl(cityTable.images)
    );
  }
  private getImageUrl(imageData?: ImageRecord | null): string {
    if (!imageData) return "";
    if (imageData.storage_path) return this.buildImageUrl(imageData.storage_path);

    return "";
  }
  private buildImageUrl(storagePath: string): string {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const bucketName = "citychat-img";

    if (!SUPABASE_URL) {
      console.error("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.");
      return "";
    }

    let relativePath = storagePath;
    if (storagePath.startsWith(bucketName)) {
      relativePath = storagePath.substring(bucketName.length + 1);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${relativePath}`;
  }

  async getCityById(id: number): Promise<City | null> {
    const { data, error } = await this.supabase
      .from("cities")
      .select(`
        id,
        name,
        description,
        image_id,
        images:image_id (
          storage_path,
          public_url
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;

    return this.mapToCity(data as unknown as CityTable);
  }

  async getAllCities(): Promise<City[]> {
    const { data, error } = await this.supabase
      .from("cities")
      .select(`
        id,
        name,
        description,
        image_id,
        images:image_id (
          storage_path,
          public_url
        )
      `);

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((city) => this.mapToCity(city as unknown as CityTable));
  }
}
