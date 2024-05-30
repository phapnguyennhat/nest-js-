import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

export class UpdateSongDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly title: string;

  @IsNotEmpty()
  @IsArray()
  // @IsString({ each: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly artists;

  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  @IsOptional()
  readonly duration: Date;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
