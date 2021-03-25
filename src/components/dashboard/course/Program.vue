<template>
  <div class="choose-box">
    <v-card rounded="0" :loading="loading">
      <!-- title -->
      <v-card-title
        class="d-flex body-1 font-weight-bold justify-space-between"
      >
        <div>2. Choose Program</div>
        <div>
          <v-icon
            :disabled="ref_id < 0"
            dense
            color="primary"
            @click="addDialog = addDialog ? false : true"
            >mdi-circle-edit-outline</v-icon
          >
          <v-icon
            :disabled="ref_id < 0"
            dense
            color="primary"
            class="ml-2"
            @click="addDialog = addDialog ? false : true"
            >mdi-plus-circle-outline</v-icon
          >
        </div>
      </v-card-title>
      <!-- subtitle -->
      <v-card-subtitle class="font-weight-light"
        >เลือกหลักสูตรที่ต้องการ</v-card-subtitle
      >
      <!-- content -->
      <v-card-text>
        <!-- <v-data-table
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
        </v-data-table> -->
        <v-select
          background-color="white2"
          rounded
          item-text="name"
          item-value="name"
          :items="itemsData"
          v-model="syncSelected"
          hide-details
        ></v-select>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { courseStore } from "@/store";

@Component({
  name: "DCourseProgram",
  components: {}
})
export default class DCourseProgram extends Vue {
  /* ---------------------------------- Data ---------------------------------- */
  addDialog = false;

  /* ---------------------------------- Props --------------------------------- */
  @Prop({ default: true }) loading!: boolean;
  @Prop() ref_id!: number;
  @PropSync("selected") syncSelected!: Record<string, any>;

  /* -------------------------------- Computed -------------------------------- */
  get itemsData() {
    return courseStore.data.programs;
  }

  /* ---------------------------------- Watch --------------------------------- */
  @Watch("syncSelected", { deep: true })
  onSelectChanged(val) {
    const index = this.itemsData.findIndex(item => item.name == val);
    if (index >= 0) this.syncSelected = this.itemsData[index];
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
