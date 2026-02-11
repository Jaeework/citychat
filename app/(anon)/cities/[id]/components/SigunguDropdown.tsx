import { regionCodeMap } from "@/app/constants/regionCodes";

interface Props {
  cityId: string;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}

export function SigunguDropdown({ cityId, value, onChange, disabled }: Props) {
  const region = regionCodeMap.find((r) => String(r.dbCityId) === cityId);
  const districts = region?.districts ?? [];

  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
      disabled={disabled}
      className=""
    >
      <option value="">전체</option>
      {districts.map((district) => (
        <option key={district.korServiceSignguCode} value={district.korServiceSignguCode}>
          {district.nameKo}
        </option>
      ))}
    </select>
  );
}
