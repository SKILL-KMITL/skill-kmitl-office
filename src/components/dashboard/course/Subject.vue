<template>
  <div class="choose-box">
    <v-card rounded="0" :loading="loading">
      <!-- title -->
      <v-card-title
        class="d-flex body-1 font-weight-bold justify-space-between"
      >
        <div>3. Choose Subject</div>
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
        >เลือกวิชาที่ต้องการ</v-card-subtitle
      >
      <!-- content -->
      <v-card-text class="px-0 py-0">
        <v-data-table
          :items="itemsData.data"
          :headers="itemsData.header"
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { courseStore } from "@/store";

@Component({
  name: "DCourseSubject",
  components: {
    // SkillDialog
  }
})
export default class DCourseSubject extends Vue {
  /* ---------------------------------- Data ---------------------------------- */
  addDialog = false;

  /* ---------------------------------- Props --------------------------------- */
  @Prop({ default: true }) loading!: boolean;
  @Prop() ref_id!: number;
  @PropSync("selected") syncSelected!: Record<string, any>;

  /* -------------------------------- Computed -------------------------------- */
  get itemsData() {
    return {
      headers: [{ text: "name", value: "name" }],
      data: courseStore.data.subjects
    };
  }

  /* ---------------------------------- Watch --------------------------------- */
  @Watch("itemsData", { deep: true })
  onItemsDataChanged(val) {
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
