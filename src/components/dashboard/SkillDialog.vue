<template>
  <v-dialog v-model="dialogSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" class="white--text">
        <v-card-title>
          <span class="headline">Add Skill</span>
        </v-card-title>
      </v-toolbar>

      <v-form ref="form" @submit.prevent="">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                :loading="loading"
                :items="skillSearchData"
                :search-input.sync="query"
                outlined
                label="เพิ่มจากทักษะจากที่มีอยู่"
                item-text="name"
                v-model="search"
                hint="เลือกทักษะจากทักษะที่มีอยู่แล้วในระบบ"
              />
              <v-divider />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                :disabled="disabled"
                :loading="loading"
                label="ชื่อทักษะภาษาอังกฤษ"
                v-model="form.name"
                outlined
                :rules="[
                  i => (i || '').length > 0 || 'ฟิลด์นี้ต้องไม่ว่างปล่าว'
                ]"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                dense
                outlined
                :disabled="disabled"
                :loading="loading"
                label="ชื่อทักษะภาษาไทย"
                v-model="form.name_th"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                :items="['Hard Skill', 'Soft Skill']"
                item-value="type"
                dense
                outlined
                :loading="loading"
                :disabled="disabled"
                label="ประเภทของทักษะ"
                v-model="form.type"
                hide-details
                :rules="[
                  i => (i || '').length > 0 || 'ฟิลด์นี้ต้องไม่ว่างปล่าว'
                ]"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                :loading="loading"
                v-model="form.desc"
                dense
                :disabled="disabled"
                outlined
                label="คำอธิบาย"
                hide-details=""
              ></v-textarea>
            </v-col>
            <v-col cols="12" class="mb-5">
              <span>ความสามารถของทักษะ</span>
              <v-icon
                dense
                color="primary"
                small
                class="ml-1"
                style="cursor: pointer;"
                :disabled="disabled"
                @click="form.ability.push('')"
                >mdi-plus-circle-outline</v-icon
              >
              <v-icon
                dense
                color="primary"
                small
                class="ml-1"
                style="cursor: pointer;"
                v-if="form.ability.length > 1"
                :disabled="disabled"
                @click="form.ability.pop()"
                >mdi-minus-circle-outline</v-icon
              >
              <v-text-field
                hide-details=""
                :loading="loading"
                :disabled="disabled"
                v-for="(ability, index) in form.ability"
                v-model="form.ability[index]"
                :key="index"
                :label="`ความสามารถ ${index + 1}`"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitAppend()" v-if="disabled">
            APPEND
          </v-btn>
          <v-btn color="primary" text @click="submitAdd()" v-else>
            ADD
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { courseStore } from "@/store";

@Component({
  name: "DSkillDialog"
})
export default class DSkillDialog extends Vue {
  mounted() {
    courseStore.searchSkill({ name: "%%" });
  }
  /* ---------------------------------- Datas --------------------------------- */
  search = "";
  query = null;
  loading = false;
  form: any = { ability: [""] };
  delayTimer;
  disabled = false;

  /* ---------------------------------- Props --------------------------------- */
  @PropSync("dialog", { default: true }) dialogSync!: boolean;
  @Prop() ref_id!: number;
  @Prop() blacklist!: Record<string, any>[];

  /* -------------------------------- Computed -------------------------------- */
  get skillSearchData() {
    return courseStore.data.skills_search.filter(
      (item: any) => !this.blacklistData.includes(item.name)
    );
  }

  get blacklistData() {
    return this.blacklist.map(item => item.name);
  }

  /* --------------------------------- Methods -------------------------------- */
  submitAppend() {
    const payload = {
      subject_id: this.ref_id,
      skill_id: this.form.id
    };
    courseStore
      .appendSkill(payload)
      .then(() => {
        this.dialogSync = false;
        this.resetForm();
        this.$swal("เพิ่มทักษะเสร็จสิ้น", "", "success");
      })
      .catch(err => {
        this.$swal("เพิ่มทักษะล้มเหลว", err.message, "error");
      });
  }

  submitAdd() {
    const payload = JSON.parse(JSON.stringify(this.form));
    payload.subject_id = this.ref_id;
    payload.ability = JSON.stringify(payload.ability)
      .replace("[", "{")
      .replace("]", "}");
    courseStore
      .addSkill(payload)
      .then(() => {
        this.dialogSync = false;
        this.resetForm();
        this.$swal("เพิ่มทักษะเสร็จสิ้น", "", "success");
      })
      .catch(err => {
        this.$swal("เพิ่มทักษะล้มเหลว", err.message, "error");
      });
  }

  resetForm() {
    this.form = { ability: [""] };
  }

  /* ---------------------------------- Watch --------------------------------- */
  @Watch("query")
  onQueryChanged(val) {
    if (val == "") {
      this.resetForm();
      this.query = null;
    } else {
      clearTimeout(this.delayTimer);
      this.loading = true;
      this.delayTimer = setTimeout(() => {
        courseStore
          .searchSkill({ name: `%${val || ""}%` })
          .then(() => (this.loading = false));
      }, 300);
    }
  }

  @Watch("search")
  onSearchChanged(val) {
    if (val) {
      // set form
      this.disabled = true;
      this.form = this.skillSearchData.filter(item => item.name == val)[0];

      // init ability if skill not have
      if (this.form.ability == null) this.form.ability = [""];
    } else {
      this.disabled = false;
    }
  }
}
</script>
