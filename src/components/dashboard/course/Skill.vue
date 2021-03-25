<template>
  <div class="choose-box">
    <v-card rounded="0" :loading="loading">
      <!-- title -->
      <v-card-title
        class="d-flex body-1 font-weight-bold justify-space-between"
      >
        <div>4. Choose Skill</div>
        <v-icon
          :disabled="ref_id < 0"
          dense
          color="primary"
          @click="addDialog = addDialog ? false : true"
          >mdi-plus-circle-outline</v-icon
        >
      </v-card-title>
      <!-- subtitle -->
      <v-card-subtitle class="font-weight-light"
        >ดูหรือเพิ่มทักษะที่ต้องการ</v-card-subtitle
      >
      <!-- content -->
      <v-card-text class="px-0 py-0">
        <v-data-table
          :items="skillData.data"
          :headers="skillData.header"
          :single-select="true"
          hide-default-header
          hide-default-footer
        >
          <template v-slot:item="{ item }">
            <tr
              @click="$emit('update:selected', item)"
              :class="{ active: item == syncSelected }"
              style="cursor: pointer;"
            >
              <td>{{ item.name }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <skill-dialog
      :dialog.sync="addDialog"
      :ref_id="ref_id"
      :blacklist="skillData.data"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { courseStore } from "@/store";
import SkillDialog from "@/components/dashboard/SkillDialog.vue";
import { Skill } from "@/@types/skill";

@Component({
  name: "DCourseSkill",
  components: {
    SkillDialog
  }
})
export default class DCourseSkill extends Vue {
  /* ---------------------------------- Data ---------------------------------- */
  addDialog = false;

  /* ---------------------------------- Props --------------------------------- */
  @Prop({ default: true }) loading!: boolean;
  @Prop() ref_id!: number;
  @PropSync("selected") syncSelected!: Record<string, any>;

  /* -------------------------------- Computed -------------------------------- */
  get skillData() {
    return {
      headers: [{ text: "name", value: "name" }],
      data: courseStore.data.skills
    };
  }

  /* ---------------------------------- Watch --------------------------------- */
  @Watch("skillData", { deep: true })
  onSkillDataChanged(val) {
    this.$emit("update:selected", val.data[0]);
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  height: 100%;
  min-height: 100%;

  .v-text-field {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
</style>
