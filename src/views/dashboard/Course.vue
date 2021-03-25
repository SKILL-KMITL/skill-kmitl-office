<template>
  <div class="d-container">
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <choose-box
          :theme="'dark'"
          :color="'primary'"
          :items.sync="facultyData"
          :selected.sync="selected.faculty"
          :header="headers.faculty"
          :loading="loading"
          :forms="forms.faculty"
          mode="select"
        />
        <choose-box
          class="mt-5"
          :theme="'light'"
          :color="'white'"
          :items="programData"
          :selected.sync="selected.program"
          :header="headers.program"
          :loading="loading"
          :forms="forms.programs"
          mode="select"
        />
        <choose-box
          class="mt-5 position-wrapper"
          :theme="'light'"
          :color="'white'"
          :items="subjectData"
          :selected.sync="selected.subject"
          :header="headers.subject"
          :loading="loading"
          :forms="forms.subjects"
          mode="table"
        />
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <DSkill
          :selected.sync="selected.skill"
          :loading="loading"
          :ref_id="selected.subject.id"
          class="position-wrapper"
        />
      </v-col>
      <v-col cols="12" md="12" lg="6">
        <v-expansion-panels accordion v-model="panels">
          <v-expansion-panel>
            <v-expansion-panel-header
              style="opacity: 1"
              class="d-flex body-1 font-weight-bold justify-space-between"
            >
              <div>Skill Detail</div>
              <div class="text-right">
                <v-fade-transition mode="out-in">
                  <v-icon
                    dense
                    color="primary"
                    class="mr-2"
                    style="z-index: 2"
                    v-if="skillDisable"
                    :disabled="selected.skill.id < 0"
                    @click.stop="skillDisable = false"
                    key="edit"
                    >mdi-circle-edit-outline</v-icon
                  >
                  <v-icon
                    v-else
                    dense
                    color="success"
                    class="mr-2"
                    style="z-index: 2"
                    :disabled="selected.skill.id < 0"
                    @click.stop="submitEditSkill()"
                    key="save"
                    >mdi-check-circle-outline</v-icon
                  >
                </v-fade-transition>
                <v-icon
                  dense
                  color="red"
                  class="mr-2"
                  style="z-index: 2"
                  :disabled="tempSelectSkill.id < 0"
                  @click.stop="submitDeleteSkill()"
                  key="save"
                  >mdi-minus-circle-outline</v-icon
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="form-skill" lazy-validation v-model="formSkillValid">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="skillDisable"
                      label="ชื่อทักษะภาษาอังกฤษ"
                      v-model="tempSelectSkill.name"
                      outlined
                      :rules="[
                        i => (i || '').length > 0 || 'ฟิลด์นี้ต้องไม่ว่างปล่าว'
                      ]"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="skillDisable"
                      label="ชื่อทักษะภาษาไทย"
                      v-model="tempSelectSkill.name_th"
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      :disabled="skillDisable"
                      label="รายละเอียดทักษะ"
                      v-model="tempSelectSkill.desc"
                      maxlength="500"
                      counter
                      outlined
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      :disabled="skillDisable"
                      label="Skill type"
                      outlined
                      hide-details
                      :rules="[
                        i => (i || '').length > 0 || 'ฟิลด์นี้ต้องไม่ว่างปล่าว'
                      ]"
                      :items="['Hard Skill', 'Soft Skill']"
                      v-model="tempSelectSkill.type"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" class="mb-5">
                    <span>ความสามารถของทักษะ</span>
                    <v-icon
                      dense
                      color="primary"
                      small
                      class="ml-1"
                      style="cursor: pointer;"
                      :disabled="skillDisable"
                      @click="tempSelectSkill.ability.push('')"
                      >mdi-plus-circle-outline</v-icon
                    >
                    <v-icon
                      dense
                      color="primary"
                      small
                      class="ml-1"
                      style="cursor: pointer;"
                      :disabled="
                        skillDisable || tempSelectSkill.ability.length <= 1
                      "
                      @click="tempSelectSkill.ability.pop()"
                      >mdi-minus-circle-outline</v-icon
                    >
                    <v-text-field
                      class="mt-2"
                      outlined
                      dense
                      hide-details
                      :loading="loading"
                      :disabled="skillDisable"
                      v-for="(ability, index) in tempSelectSkill.ability"
                      v-model="tempSelectSkill.ability[index]"
                      :rules="[
                        i => (i || '').length > 0 || 'ฟิลด์นี้ต้องไม่ว่างปล่าว'
                      ]"
                      :key="index"
                      :label="`ความสามารถ ${index + 1}`"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header
              style="opacity: 1"
              class="d-flex body-1 font-weight-bold justify-space-between"
            >
              <div>Subject Detail</div>
              <div class="text-right">
                <v-fade-transition mode="out-in">
                  <v-icon
                    dense
                    color="primary"
                    class="mr-2"
                    style="z-index: 2"
                    v-if="positionDisable"
                    :disabled="tempSelectSubject.id < 0"
                    @click.stop="positionDisable = false"
                    key="edit"
                    >mdi-circle-edit-outline</v-icon
                  >
                  <v-icon
                    v-else
                    dense
                    color="success"
                    class="mr-2"
                    style="z-index: 2"
                    :disabled="tempSelectSubject.id < 0"
                    @click.stop="submitEditSubject()"
                    key="save"
                    >mdi-check-circle-outline</v-icon
                  >
                </v-fade-transition>
                <v-icon
                  dense
                  color="red"
                  class="mr-2"
                  style="z-index: 2"
                  :disabled="tempSelectSubject.id < 0"
                  @click.stop="submitDeleteSubject()"
                  key="save"
                  >mdi-minus-circle-outline</v-icon
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form
                ref="form-subject"
                lazy-validation
                v-model="formSubjectValid"
              >
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="positionDisable"
                      :loading="loading"
                      label="ชื่อวิชาภาษาอังกฤษ"
                      v-model="tempSelectSubject.name"
                      required
                      outlined
                    >
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="positionDisable"
                      :loading="loading"
                      label="ชื่อวิชาภาษาไทย"
                      v-model="tempSelectSubject.name_th"
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="positionDisable"
                      :loading="loading"
                      label="รหัสวิชา"
                      v-model="tempSelectSubject.subject_id"
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      :disabled="positionDisable"
                      :loading="loading"
                      label="Description"
                      v-model="tempSelectSubject.desc"
                      maxlength="500"
                      counter
                      outlined
                    >
                    </v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Dashboard from "./Dashboard.vue";
import ChooseBox from "@/components/dashboard/ChooseBox.vue";
import { Component, Watch } from "vue-property-decorator";
import { courseStore } from "@/store";
import { Skill } from "@/@types/skill";
import { Subject } from "@/@types/course";
import DSkill from "@/components/dashboard/course/Skill.vue";
import DSubject from "@/components/dashboard/course/Subject.vue";
@Component({
  name: "DCourse",
  components: {
    ChooseBox,
    DSkill,
    DSubject
  }
})
export default class Course extends Dashboard {
  /* ---------------------------------- Init ---------------------------------- */
  mounted() {
    courseStore.fetchCourse().then(() => {
      this.loading = false;
      this.selected.faculty = this.facultyData[0];
      this.selected.program = this.programData[0];
      this.selected.skill = this.skillData.data[0];
    });
  }
  panels = 0;
  positionDisable = true;
  skillDisable = true;
  tempSelectSkill = new Skill();
  tempSelectSubject = new Subject();
  formSubjectValid = true;
  formSkillValid = true;
  private forms = {
    faculty: {
      header: "Faculty",
      onAdd: courseStore.insertFaculty,
      onUpdate: courseStore.updateFaculty,
      onDelete: courseStore.deleteFaculty,
      form: [
        {
          name: "name",
          cols: 12,
          label: "ชื่อคณะ",
          input: "text-field",
          rules: [val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว"],
          value: ""
        }
      ]
    },
    programs: {
      header: "Programs",
      onAdd: courseStore.insertProgram,
      onUpdate: courseStore.updateProgram,
      onDelete: courseStore.deleteProgram,
      ref: {
        course_faculty_id: null
      },
      form: [
        {
          name: "name",
          cols: 12,
          label: "ชื่อโปรแกรม",
          input: "text-field",
          rules: [val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว"],
          value: ""
        }
      ]
    },
    subjects: {
      header: "Subjects",
      onAdd: courseStore.insertSubject,
      ref: {
        course_program_id: null
      },
      form: [
        {
          name: "name",
          cols: 6,
          label: "ชื่อวิชาภาษาอังกฤษ",
          input: "text-field",
          rules: [val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว"],
          value: ""
        },
        {
          name: "name_th",
          cols: 6,
          label: "ชื่อวิชาภาษาไทย",
          input: "text-field",
          rules: [val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว"],
          value: ""
        },
        {
          name: "subject_id",
          cols: 6,
          label: "รหัสวิชา (ตัวเลข)",
          input: "text-field",
          type: "number",
          rules: [
            val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว",
            val => !isNaN(val || 0) || "ต้องเป็นตัวเลขเท่านั้น"
          ],
          value: 0
        },
        {
          name: "desc",
          cols: 12,
          label: "รายละเอียดวิชา",
          input: "textarea",
          counter: 600,
          rules: [val => (val || "").length > 0 || "ฟิลด์นี้ต้องไม่ว่างปล่าว"],
          value: ""
        }
      ]
    }
  };

  private headers = {
    faculty: {
      title: "1. Choose Faculty",
      subtitle: "เลือกคณะที่ต้องการ",
      icon: {
        color: "white",
        add: true,
        edit: true
      }
    },
    program: {
      title: "2. Choose Program",
      subtitle: "เลือกหลักสูตรที่ต้องการ",
      icon: {
        color: "primary",
        add: true,
        edit: true
      }
    },
    subject: {
      title: "3. Choose Subject",
      subtitle: "เลือกวิชาที่ต้องการ",
      icon: {
        color: "primary",
        add: true
      }
    }
  };

  private loading = true;
  public selected: any = {
    faculty: this.facultyData[0],
    program: this.programData[0],
    subject: this.subjectData.data[0],
    skill: this.skillData.data[0]
  };

  /* -------------------------------- Computed -------------------------------- */
  get courseData() {
    return courseStore.data;
  }
  get facultyData() {
    return courseStore.data.facultys;
  }
  get programData() {
    return courseStore.data.programs;
  }
  get subjectData() {
    return {
      headers: [{ text: "name", value: "name" }],
      data: courseStore.data.subjects
    };
  }
  get skillData() {
    return {
      headers: [{ text: "name", value: "name" }],
      data: courseStore.data.skills.map(item => (item["ability"] = [""]))
    };
  }

  /* --------------------------------- Methods -------------------------------- */
  async submitEditSkill() {
    const form: any = this.$refs["form-skill"];
    form.validate();
    if (this.formSkillValid) {
      // create payload
      const payload = JSON.parse(JSON.stringify(this.tempSelectSkill));
      delete payload.__typename;
      payload.ability = JSON.stringify(payload.ability)
        .replace("[", "{")
        .replace("]", "}");
      await courseStore.updateSkill(payload).then(resp => {
        courseStore.fetchSkill({ id: this.selected.subject.id });
        this.selected.skill = resp;
        this.skillDisable = true;
      });
    }
  }

  async submitDeleteSkill() {
    this.$swal({
      title: "ยืนยันการลบ",
      html: `คุณต้องการทักษะ <b>"${this.tempSelectSkill.name}"</b> ออกจากวิชา <b>"${this.selected.subject.name}"</b> หรือไม่?`,
      icon: "warning",
      confirmButtonColor: "#f44336",
      cancelButtonText: "CANCEL",
      confirmButtonText: `DELETE`,
      showCancelButton: true,
      focusCancel: true
    }).then(async result => {
      if (result.isConfirmed) {
        courseStore
          .deleteSkill({
            subject_id: this.selected.subject.id,
            skill_id: this.selected.skill.id
          })
          .then(() =>
            this.$swal(
              "ทำการลบสำเร็จ",
              `การลบวิชา "${this.tempSelectSkill.name}" ออกจากหลักสูตร "${this.selected.subject.name}" เสร็จสิ้น`,
              "success"
            )
          );
      }
    });
  }

  async submitEditSubject() {
    const form: any = this.$refs["form-subject"];
    form.validate();
    if (this.formSubjectValid) {
      // create payload
      const payload = JSON.parse(JSON.stringify(this.tempSelectSubject));
      delete payload.__typename;
      delete payload.course_program_id;
      -(await courseStore.updateSubject(payload).then(resp => {
        courseStore.fetchSubject(this.selected.program.id);
        this.selected.subject = resp;
        this.positionDisable = true;
      }));
    }
  }

  async submitDeleteSubject() {
    this.$swal({
      title: "ยืนยันการลบ",
      html: `คุณต้องการลบวิชา <b>"${this.selected.subject.name}"</b> ออกจากหลักสูตร <b>"${this.selected.program.name}"</b> หรือไม่?`,
      icon: "warning",
      confirmButtonColor: "#f44336",
      cancelButtonText: "CANCEL",
      confirmButtonText: `DELETE`,
      showCancelButton: true,
      focusCancel: true
    }).then(async result => {
      if (result.isConfirmed) {
        courseStore
          .deleteSubject({ id: this.selected.subject.id })
          .then(() =>
            this.$swal(
              "ทำการลบสำเร็จ",
              `การลบวิชา "${this.tempSelectSubject.name}" ออกจากหลักสูตร "${this.selected.program.name}" เสร็จสิ้น`,
              "success"
            )
          );
      }
    });
  }

  /* ---------------------------------- Watch --------------------------------- */

  // Faculty
  @Watch("facultyData", { deep: true })
  async onFacultyDataChanged(val, old) {
    if (
      val.length !== old.length ||
      JSON.stringify(val) !== JSON.stringify(old)
    ) {
      await courseStore.fetchCourse();
      this.selected.faculty = this.facultyData[0];
    }
  }
  @Watch("selected.faculty", { deep: true })
  async onSelectFacultyChanged(val) {
    if (val.id) {
      this.forms.programs.ref = {
        course_faculty_id: val.id
      };
      await courseStore.fetchProgram(val.id).then(() => {
        this.selected.program = this.programData[0];
      });
    }
  }

  // Program
  @Watch("programData")
  onProgramDataChanged(val, old) {
    if (
      val.length !== old.length ||
      JSON.stringify(val) !== JSON.stringify(old)
    )
      this.selected.program = val[0];
  }
  @Watch("selected.program.id", { immediate: true })
  async onSelectProgramChanged(val) {
    if (val) {
      this.forms.subjects.ref = {
        course_program_id: val
      };
      await courseStore.fetchSubject(val);
    }
  }

  // Subject;
  @Watch("subjectData.data", { deep: true })
  onSubjectDataChanged(val, old) {
    if (
      val.length !== old.length ||
      JSON.stringify(val) !== JSON.stringify(old)
    )
      this.selected.subject = val[0];
  }

  @Watch("selected.subject", { deep: true })
  async onSelectSubjectChanged(val, old) {
    if (val !== old) {
      await courseStore.fetchSkill({ id: val.id });
      this.tempSelectSubject = JSON.parse(JSON.stringify(val));
    }
  }

  @Watch("selected.skill", { deep: true })
  onSelectSkillChanged(val, old) {
    if (val !== old) {
      this.tempSelectSkill = JSON.parse(JSON.stringify(val));
      if (!val.ability) {
        this.tempSelectSkill.ability = [""];
      }
    }
  }
}
</script>

<style lang="scss">
@import "~vuetify/src/styles/settings/_variables";
.d-container,
.d-container > .row,
.d-container > .row > div {
  height: 100%;
  min-height: 100%;
}
@media #{map-get($display-breakpoints, 'md-and-down')} {
  .d-container,
  .d-container > .row,
  .d-container > .row > div {
    height: auto;
    min-height: 100%;
  }
}
.position-wrapper {
  overflow-y: scroll;
}
.position-wrapper,
.position-wrapper > div {
  height: 100%;
}
.d-container > .row > div {
  display: flex;
  flex-direction: column;
}
.choose-box {
  box-shadow: 0 1px 15px 1px rgba(0, 0, 0, 0.144);
}
</style>
