import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common/enums';

export type IRequest = Request;

export type IResponse = Response;

export interface ResponseResult {
  statusCode: number;
  message?: string[];
  payload?: any;
  failures?: ResponseFailure[];
}

interface ResponseFailure {
  reason?: string;
  message?: string;
}

export const SuccessResult = (payload?: any): ResponseResult => ({
  statusCode: HttpStatus.OK,
  payload,
});

export const NoContentResult = (): ResponseResult => ({
  statusCode: HttpStatus.NO_CONTENT,
});

export const BadRequestResult = (
  failures?: ResponseFailure | ResponseFailure[] | string,
): ResponseResult => ({
  statusCode: HttpStatus.BAD_REQUEST,
  failures:
    typeof failures === 'string'
      ? [
          {
            message: failures,
          },
        ]
      : Array.isArray(failures)
      ? failures
      : [failures],
});

export const ForbiddenResult = (
  failures: ResponseFailure | ResponseFailure[] | string,
): ResponseResult => ({
  statusCode: HttpStatus.FORBIDDEN,
  failures:
    typeof failures === 'string'
      ? [
          {
            message: failures,
          },
        ]
      : Array.isArray(failures)
      ? failures
      : [failures],
});

export const NotFoundResult = (
  failures: ResponseFailure | ResponseFailure[] | string,
): ResponseResult => ({
  statusCode: HttpStatus.NOT_FOUND,
  failures:
    typeof failures === 'string'
      ? [
          {
            message: failures,
          },
        ]
      : Array.isArray(failures)
      ? failures
      : [failures],
});

export const ConflictResult = (
  failures: ResponseFailure | ResponseFailure[] | string,
): ResponseResult => ({
  statusCode: HttpStatus.CONFLICT,
  failures:
    typeof failures === 'string'
      ? [
          {
            message: failures,
          },
        ]
      : Array.isArray(failures)
      ? failures
      : [failures],
});

export const ServerErrorResult = (
  failures: ResponseFailure | ResponseFailure[] | string,
): ResponseResult => ({
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  failures:
    typeof failures === 'string'
      ? [
          {
            message: failures,
          },
        ]
      : Array.isArray(failures)
      ? failures
      : [failures],
});
