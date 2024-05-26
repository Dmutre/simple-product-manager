import { HttpException, HttpStatus } from "@nestjs/common";


export class InvalidEntityException extends HttpException {
  constructor(entity) {
    super(`${entity} with such id was not found`, HttpStatus.NOT_FOUND);
  }
}