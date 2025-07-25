import { NextRequest, NextResponse } from "next/server";
import { SbChatRepository } from "@/backend/infrastructure/repositories/SbChatRepository";
import { createClient } from "@/utils/supabase/server";
import { GetCurrentUserChatListUsecase } from "@/backend/application/chats/usecases/GetCurrentUserChatListUsecase";
import { verifyAccessToken } from "@/utils/auth/tokenUtils";
import { GetChatListRequestDto } from "@/backend/application/chats/dtos/GetChatListRequestDto";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const chatRepository = new SbChatRepository(supabase);
    const getChatListUseCase = new GetCurrentUserChatListUsecase(chatRepository);

    // Authorization 헤더에서 토큰 추출
    const authorization = request.headers.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No valid token provided" },
        { status: 401 }
      );
    }

    const token = authorization.split(" ")[1];
    const decode = verifyAccessToken(token);
    const tokenPayload = decode.payload;
    const userIdRaw = tokenPayload?.userInfo?.id; // 토큰에서 사용자 ID 추출
    const userId = typeof userIdRaw === "string" ? parseInt(userIdRaw, 10) : userIdRaw;

    if (typeof userId !== "number" || isNaN(userId)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid user ID in token" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestDto: GetChatListRequestDto = {
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!, 10) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined,
      chatRoomId: searchParams.get("chatRoomId") ? parseInt(searchParams.get("chatRoomId")!, 10) : undefined
    };

    const result = await getChatListUseCase.execute(userId, requestDto);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid token") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
