<template>
  <div class="d-container">
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <choose-box
          :theme="'dark'"
          :color="'primary'"
          :items="items1"
          :selected.sync="selected.field"
          :header="headers.field"
          :loading="loading"
          mode="select"
        />
        <choose-box
          class="mt-5"
          :theme="'light'"
          :color="'white'"
          :items="items2"
          :selected.sync="selected.group"
          :header="headers.group"
          :loading="loading"
          mode="select"
        />

        <choose-box
          class="mt-5 position-wrapper"
          :theme="'light'"
          :color="'white'"
          :items="items3"
          :selected.sync="selected.position"
          :header="headers.position"
          :loading="loading"
          mode="table"
        />
      </v-col>
      <v-col cols="12" md="6" lg="3" class="d-flex flex-column">
        <choose-box
          class="position-wrapper"
          :theme="'light'"
          :color="'white'"
          :items="items3"
          :selected.sync="selected.skill"
          :header="headers.position"
          :loading="loading"
          mode="table"
        />
      </v-col>
      <v-col cols="12" md="12" lg="6">
        <v-expansion-panels accordion v-model="panels">
          <v-expansion-panel>
            <v-expansion-panel-header
              style="opacity: 1"
              class="d-flex body-1 font-weight-bold justify-space-between"
            >
              <div>Position Detail</div>
              <div class="text-right">
                <v-fade-transition mode="out-in">
                  <v-icon
                    dense
                    color="primary"
                    class="mr-2"
                    style="z-index: 2"
                    v-if="positionDisable"
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
                    @click.stop="positionDisable = true"
                    key="save"
                    >mdi-check-circle-outline</v-icon
                  >
                </v-fade-transition>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="positionDisable"
                      label="Name"
                      v-model="positionDetail.name"
                      required
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="positionDisable"
                      label="Name thai"
                      v-model="positionDetail.nameTh"
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      :disabled="positionDisable"
                      label="Description"
                      v-model="positionDetail.desc"
                      maxlength="500"
                      counter
                      outlined
                    >
                    </v-textarea>
                  </v-col>
                  <v-col cols="12" md="12">
                    <div :class="{ 'grey--text': positionDisable }">Duties</div>
                    <v-text-field
                      :disabled="positionDisable"
                      class="mb-1"
                      hide-details
                      dense
                      v-for="(dutie, index) in positionDetail.duties"
                      :key="index"
                      v-model="positionDetail.duties[index]"
                      outlined
                    >
                    </v-text-field>
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
              <div>Skill Detail</div>
              <div class="text-right">
                <v-fade-transition mode="out-in">
                  <v-icon
                    dense
                    color="primary"
                    class="mr-2"
                    style="z-index: 2"
                    v-if="skillDisable"
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
                    @click.stop="skillDisable = true"
                    key="save"
                    >mdi-check-circle-outline</v-icon
                  >
                </v-fade-transition>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="skillDisable"
                      label="Name"
                      v-model="skillDetail.name"
                      required
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :disabled="skillDisable"
                      label="Name thai"
                      v-model="skillDetail.nameTh"
                      outlined
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-textarea
                      :disabled="skillDisable"
                      label="Description"
                      v-model="skillDetail.desc"
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
                      :items="['Hardskill', 'Softskill']"
                      v-model="skillDetail.type"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      :disabled="skillDisable"
                      label="Level"
                      outlined
                      hide-details
                      :items="[1, 2, 3, 4]"
                      v-model="skillDetail.level"
                    >
                    </v-select>
                  </v-col>
                  <v-col cols="12" md="12">
                    <div :class="{ 'grey--text': skillDisable }">Abilities</div>
                    <v-text-field
                      :disabled="skillDisable"
                      class="mb-1"
                      hide-details
                      dense
                      v-for="(dutie, index) in skillDetail.ability"
                      :key="index"
                      v-model="skillDetail.ability[index]"
                      outlined
                    >
                    </v-text-field>
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
import { Component } from "vue-property-decorator";

import Dashboard from "./Dashboard.vue";
import ChooseBox from "@/components/dashboard/ChooseBox.vue";

@Component({
  components: {
    ChooseBox
  }
})
export default class Career extends Dashboard {
  input1 = "";
  items1 = ["Engineer", "Finance", "Marketing", "Artistic"];
  items2 = [
    "Automotive",
    "Telecommunication",
    "Industiral engineer",
    "Biomedical engineer"
  ];

  header = [
    {
      text: "Dessert (100g serving)",
      align: "start",
      sortable: false,
      value: "name"
    }
  ];
  items3 = {
    header: [{ text: "name", value: "name" }],
    data: [
      { name: "Automotive electrician" },
      { name: "Automotive instructor" },
      { name: "Automotive testing engineer" },
      { name: "Automotive repiar technician" },
      { name: "Automotive mechanic" },
      { name: "Vehicle inspector" },
      { name: "Automotive engineer" },
      { name: "Car detailer" },
      { name: "Automotive sales manager" },
      { name: "Automotive tire" },
      { name: "Thailand" }
    ]
  };

  panels = 0;
  positionDisable = true;
  skillDisable = true;

  /* ---------------------------------- Real ---------------------------------- */
  public loading = false;
  public headers = {
    field: {
      title: "1. Choose Field",
      subtitle: "เลือกสายอาชีพที่ต้องการ",
      icon: {
        color: "white",
        add: true,
        edit: true
      }
    },
    group: {
      title: "2. Choose Group",
      subtitle: "เลือกกลุ่มอาชีพที่ต้องการ",
      icon: {
        color: "primary",
        add: true,
        edit: true
      }
    },
    position: {
      title: "3. Choose Position",
      subtitle: "เลือกตำแหน่งงานที่ต้องการ",
      icon: {
        color: "primary",
        add: true
      }
    }
  };
  public selected = {
    field: this.items1[0],
    group: this.items2[0],
    position: this.items3.data[0],
    skill: this.items3.data[0]
  };

  public positionDetail = {
    name: "Automotive Instructor",
    nameTh: "อาจารย์สอนยานยนต์",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type",
    duties: ["Doing1", "Dogin2", "Dogin3"]
  };
  public skillDetail = {
    name: "Automotive Instructor",
    nameTh: "อาจารย์สอนยานยนต์",
    type: "Hardskill",
    level: 4,
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type",
    ability: ["Doing1", "Dogin2", "Dogin3"]
  };
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
