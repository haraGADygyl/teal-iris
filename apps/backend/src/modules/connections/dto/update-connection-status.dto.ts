import { IsIn } from "class-validator";
import { ConnectionStatus } from "../../../db/schema.js";

export class UpdateConnectionStatusDto {
  @IsIn([ConnectionStatus.ACCEPTED, ConnectionStatus.REJECTED])
  status!: ConnectionStatus.ACCEPTED | ConnectionStatus.REJECTED;
}
