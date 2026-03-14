import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// 请求ID存储
const requestStore = new Map<string, { startTime: number; data?: unknown }>();

// 清理过期请求ID（1小时后）
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of requestStore.entries()) {
    if (now - data.startTime > 60 * 60 * 1000) {
      requestStore.delete(id);
    }
  }
}, 60 * 60 * 1000);

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    duration: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 生成请求ID
 */
export function generateRequestId(): string {
  return nanoid(12);
}

/**
 * 创建成功响应
 */
export function createSuccessResponse<T>(
  data: T,
  requestId: string,
  startTime: number
): NextResponse<ApiSuccessResponse<T>> {
  const duration = Date.now() - startTime;
  
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      duration,
    },
  };

  return NextResponse.json(response);
}

/**
 * 创建错误响应
 */
export function createErrorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, { status: 400 });
}

/**
 * API 处理器包装器
 */
export function withApiHandler<T>(
  handler: (req: Request, requestId: string) => Promise<T>
): (req: Request) => Promise<NextResponse> {
  return async (req: Request): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    // 存储请求信息
    requestStore.set(requestId, { startTime });
    
    try {
      const data = await handler(req, requestId);
      return createSuccessResponse(data, requestId, startTime);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      return createErrorResponse('INTERNAL_ERROR', message, requestId);
    }
  };
}

/**
 * 获取请求信息
 */
export function getRequestInfo(requestId: string): { startTime: number; data?: unknown } | undefined {
  return requestStore.get(requestId);
}
