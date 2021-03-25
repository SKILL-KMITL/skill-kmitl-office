export class Position {
  id?: number;
  name: string;
  nameTH?: string;
  desc?: string;
  tasks: string[];

  constructor() {
    this.id = 0;
    this.name = "Choose Position";
    this.nameTH = "เลือกตำแหน่งงาน";
    this.desc = "รายละเอียดตำแหน่งงาน";
    this.tasks = ["ภาระที่ต้องรับผิดชอบ"];
  }
}
