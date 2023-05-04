export interface ServiceResponse<
  TResult,
  TFailure extends ServiceFailure<any>,
> {
  status: ServiceResponseStatus;
  failure?: TFailure;
  result?: TResult;
}

export interface ServiceFailure<TReason> {
  reason: TReason;
  payload?: any;
}

export enum ServiceResponseStatus {
  Success = 'Success',
  Failed = 'Failed',
}
