export class Skill {
  id?: number;
  name: string;
  name_th?: string;
  desc?: string;
  type: string;
  ability: string[];

  constructor() {
    this.id = 0;
    this.name = "Empty Skill...";
    this.name_th = "เลือกทักษะ";
    this.desc = "รายละเอียดทักษะ";
    this.type = "เลือกประเภททักษะ";
    this.ability = ["ความสามารถ"];
  }
}
