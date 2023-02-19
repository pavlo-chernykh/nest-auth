import { ApiProperty } from '@nestjs/swagger';

export default class SetProfileImageDto {
  @ApiProperty({
    example: 'img/a4723670-512c-4268-8a27-a9b5fbe8eb02.jpeg',
  })
  profilePhoto: string;
}
