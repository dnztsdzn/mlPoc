export interface FineTuneModelListResponse {
    id: string;
    model: string;
    status:string;
    fine_tuned_model?:string;
}