<template>
  <div class="choose-box">
    <!-- card -->
    <v-card
      :class="[{ 'white--text': theme != 'light' }, { [color]: true }]"
      :loading="loading ? (theme != 'light' ? 'white' : 'primary') : false"
      :disabled="loading"
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
            @click="openEditDialog()"
            :disabled="syncSelected.id == -1"
            >mdi-circle-edit-outline</v-icon
          >
          <v-icon
            dense
            v-if="header.icon.add"
            :disabled="
              (forms.ref ? forms.ref[Object.keys(forms.ref || {})] : false) < 0
            "
            :color="header.icon.color"
            @click="openAddDialog()"
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
      <v-card-text :class="{ 'px-0 py-0': mode !== 'select' }">
        <v-select
          v-if="mode == 'select'"
          background-color="white2"
          rounded
          item-text="name"
          item-value="name"
          :items="syncItems"
          v-model="syncSelected"
          hide-details
        ></v-select>

        <v-data-table
          v-else
          :items="syncItems.data"
          :headers="syncItems.header"
          :single-select="true"
          hide-default-header
          hide-default-footer
          height="100%"
        >
          <template v-slot:item="{ item }">
            <tr
              @click="syncSelected = item"
              :class="{ active: item == syncSelected }"
              style="cursor: pointer;"
            >
              <td>{{ item.name }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add Dialog -->
    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-toolbar color="primary" class="white--text">
          <v-card-title>
            <span class="headline">Add {{ forms.header }}</span>
          </v-card-title>
        </v-toolbar>

        <v-form ref="form-add" @submit.prevent="submitAdd()">
          <v-card-text class="mt-5">
            <v-row>
              <v-col
                :cols="item.cols || 12"
                class="pb-0"
                v-for="(item, key) in forms.form"
                :key="item.name"
              >
                <v-text-field
                  :label="item.label"
                  outlined
                  dense
                  v-if="item.input == 'text-field'"
                  :rules="item.rules"
                  v-model="forms.form[key].value"
                  :counter="item.counter"
                ></v-text-field>
                <v-textarea
                  :label="item.label"
                  outlined
                  dense
                  v-if="item.input == 'textarea'"
                  :rules="item.rules"
                  v-model="forms.form[key].value"
                  :counter="item.counter"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text type="submit" :disabled="!formIsValid">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-toolbar color="primary" class="white--text">
          <v-card-title>
            <span class="headline">Edit {{ forms.header }}</span>
          </v-card-title>
        </v-toolbar>

        <v-form ref="form-edit" @submit.prevent="submitEdit()">
          <v-card-text class="mt-5">
            <v-row>
              <v-col
                :cols="item.cols || 12"
                v-for="(item, key) in forms.form"
                :key="item.name"
              >
                <v-text-field
                  :label="item.label"
                  outlined
                  dense
                  v-if="item.input == 'text-field'"
                  :rules="item.rules"
                  v-model="forms.form[key].value"
                  :counter="item.counter"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              :disabled="!formIsValid"
              @click="deleteEdit"
            >
              Delete
            </v-btn>
            <v-btn color="primary" text type="submit" :disabled="!formIsValid">
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";

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
  /* ---------------------------------- Props --------------------------------- */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  @Prop() loading!: boolean;
  @Prop({ default: "light" }) readonly theme!: string;
  @Prop({ default: "white" }) readonly color!: string;
  @Prop() readonly forms: any;
  @Prop({ default: "select" }) readonly mode!: string;
  @Prop({ default: false }) readonly fullHeight!: boolean;
  @PropSync("items") readonly syncItems!: any;
  @PropSync("selected") syncSelected!: Record<string, any>;
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

  /* ---------------------------------- Data ---------------------------------- */
  private editDialog = false;
  private addDialog = false;
  private payload = {};

  /* -------------------------------- Computed -------------------------------- */
  get formIsValid() {
    return this.forms.form
      .map(item => item.value || undefined)
      .every(item => item);
  }

  /* --------------------------------- Methods -------------------------------- */
  public openEditDialog() {
    this.editDialog = true;
    // inject value into each field
    for (const index in this.forms.form) {
      this.forms.form[index].value = this.syncSelected[
        this.forms.form[index].name
      ];
    }
  }

  private openAddDialog() {
    this.addDialog = true;
    // empty value into each field
    for (const index in this.forms.form) {
      if (this.forms.form[index].input !== "hidden") {
        this.forms.form[index].value = "";
      }
    }
  }

  private async deleteEdit() {
    this.payload = {};
    this.payload["id"] = this.syncSelected.id;
    await this.forms
      .onDelete(this.payload)
      .then(() => {
        this.$swal(`ทำการลบเสร็จสิ้น`, "", "success").then(() => {
          this.resetForm();
          this.editDialog = false;
        });
      })
      .catch(err => {
        this.$swal(`ลบข้อมูลล้มเหลว`, err.message, "error");
      });
  }

  private async submitEdit() {
    this.payload = {};
    this.forms.form.map((item, key) => {
      this.payload[item.name] = item.value;
      this.payload["where"] = this.syncSelected.id;
    });

    await this.forms
      .onUpdate(this.payload)
      .then(() => {
        this.$swal(`ทำการแก้ไขสำเร็จ`, "", "success").then(() => {
          this.resetForm();
          this.editDialog = false;
        });
      })
      .catch(err => {
        this.$swal(`ชื่อนี้ถูกใช้ไปแล้ว`, err.message, "error");
      });
  }
  private async submitAdd() {
    this.payload = {};
    this.forms.form.map((item, key) => {
      this.payload[item.name] =
        item.type == "number" ? +item.value : item.value;

      if (this.forms.ref) {
        const refKey = Object.keys(this.forms.ref)[0];
        this.payload[refKey] = this.forms.ref[refKey];
      }
    });

    await this.forms
      .onAdd(this.payload)
      .then(() => {
        this.$swal(`ทำการเพิ่มสำเร็จ`, "", "success").then(() => {
          this.resetForm();
          this.addDialog = false;
        });
      })
      .catch(err => {
        this.$swal(`ชื่อนี้ถูกใช้ไปแล้ว`, err.message, "error");
      });
  }

  private resetForm() {
    this.forms.form.map((item, key) => {
      this.forms.form[key].value = "";
    });
  }

  // @Watch("syncItems", { deep: true })
  // onItemChanged(val) {
  //   console.log(val);
  //   if (this.mode == "table") {
  //     this.$emit("update:selected", val.data[0]);
  //   }
  // }
  @Watch("syncSelected", { deep: true })
  onSelectChanged(val) {
    if (this.mode !== "table") {
      const index = this.syncItems.findIndex(item => item.name == val);
      if (index >= 0) this.syncSelected = this.syncItems[index];
    }
  }
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
