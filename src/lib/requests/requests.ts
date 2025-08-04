import { axiosAPI } from "../axios-api";
import type { Request } from "@/types/requests";

export async function getRequests() {
  try {
    const result = await axiosAPI<Request[]>({
      endpoint: `/requests/`,
      method: "GET",
      queryParams: { status: 'pendent' }
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export interface UpdateRequestPayload {
  status: 'approved' | 'rejected';
  reason_rejected?: string;
}

export async function updateRequest(requestId: string, payload: UpdateRequestPayload) {
  try {
    const data: any = {
      status: payload.status
    };

    if (payload.status === 'rejected') {
      if (!payload.reason_rejected) {
        throw new Error('Motivo de rejeição é obrigatório quando o status é rejected');
      }
      data.reason_rejected = payload.reason_rejected;
    }

    const result = await axiosAPI({
      endpoint: `/requests/${requestId}`,
      method: "PUT",
      data
    });

    return { success: true, data: result.data };
  } catch (err) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}