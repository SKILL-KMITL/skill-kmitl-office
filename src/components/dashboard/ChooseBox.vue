<template>
  <div class="choose-box">
    <!-- card -->
    <div
      :class="[{ 'white--text': theme != 'light' }, { [color]: true }]"
      :loading="loading ? (theme != 'light' ? 'white' : 'primary') : false"
      rounded="0"
    >
      <!-- title -->
      <v-card-title
        class="d-flex body-1 font-weight-bold justify-space-between"
      >
        <div>{{ header.title }}</div>
        <div>
          <v-icon
            dense
            v-if="header.icon.edit"
            :color="header.icon.color"
            class="mr-2"
            >mdi-circle-edit-outline</v-icon
          >
          <v-icon dense v-if="header.icon.add" :color="header.icon.color"
            >mdi-plus-circle-outline</v-icon
          >
        </div>
      </v-card-title>

      <!-- subtitle -->
      <v-card-subtitle
        :class="{ 'white--text': theme != 'light' }"
        class="font-weight-light"
        >{{ header.subtitle }}</v-card-subtitle
      >

      <!-- content -->
      <!-- <v-card-text class="h-100"> </v-card-text> -->
      <v-card-text :class="{ 'px-0': mode !== 'select' }">
        <v-select
          v-if="mode == 'select'"
          background-color="white2"
          rounded
          :items="items"
          v-model="syncSelected"
          hide-details
        ></v-select>

        <v-data-table
          v-else
          :items="items.data"
          :headers="items.header"
          :single-select="true"
          hide-default-header
          hide-default-footer
          height="100%"
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

interface Selected {
  field: string;
  group: string;
  position: unknown;
  skill: unknown;
}

interface Header {
  title: string;
  icon?: {
    color: string;
    edit: boolean;
    add: boolean;
  };
  subtitle?: string;
}

@Component({
  name: "ChooseBox"
})
export default class ChooseBox extends Vue {
  @Prop({ default: true }) loading!: boolean;
  @Prop({ default: "light" }) readonly theme!: string;
  @Prop({ default: "white" }) readonly color!: string;
  @Prop({ default: ["Item1", "Item2"] }) readonly items!: string[];
  @Prop({ default: "select" }) readonly mode!: string;
  @Prop({ default: false }) readonly fullHeight!: boolean;
  @PropSync("selected") syncSelected!: unknown;
  @Prop({
    default() {
      return {
        title: "no title",
        icon: {
          color: "primary",
          edit: true,
          add: true
        },
        subtitle: "no subtitle"
      };
    },
    type: Object
  })
  readonly header!: Header;
}
</script>

<style lang="scss" scoped>
// @import "~bootstrap-vue/src/components/table";
.v-card {
  height: 100%;
  min-height: 100%;

  .v-text-field {
    margin-top: 0;
    margin-bottom: 10px;
  }
}
</style>
