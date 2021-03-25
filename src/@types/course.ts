export class Subject {
  id?: number;
  name: string;
  nameTh?: string;
  desc?: string;
  subjectId: number;

  constructor() {
    this.id = 0;
    this.name = "Empty subject...";
    this.nameTh = "กรุณาเพิ่มวิชา";
    this.desc = "รายละเอียดวิชา";
    this.subjectId = 0;
  }
}
