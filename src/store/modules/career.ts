import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Position } from "@/@types/career";
import { Skill } from "@/@types/skill";
import gql from "graphql-tag";

@Module({
  name: "career",
  namespaced: true,
  stateFactory: true
})
export default class CareerStore extends VuexModule {
  fields = [{ name: "Field is empty", id: 0 }];
  groups = [{ name: "Group is empty", id: 0 }];
  positions: Position[] = [new Position()];
  skills: Skill[] = [new Skill()];

  /* --------------------------------- Getters -------------------------------- */
  get careerData() {
    return {
      fields: this.fields,
      groups: this.groups,
      positions: this.positions,
      skills: this.skills
    };
  }

  /* -------------------------------- Mutations -------------------------------- */

  @Mutation
  updateCareer(data: UpdateCareer) {
    this[data.key] = data.value;
  }

  @Mutation
  resetCareer() {
    this.fields = [{ name: "Choose Field", id: 0 }];
    this.groups = [{ name: "Choose Group", id: 0 }];
    this.positions = [new Position()];
    this.skills = [new Skill()];
  }

  /* --------------------------------- Actions -------------------------------- */
  @Action({ rawError: true })
  async fetchCareer() {
    await this.fetchFields();
    // await this.fetchGroups(this.fields[0].id);
    // await this.fetchPositions(this.groups[0].id);
    // await this.fetchSkills(this.positions[0].id);
  }

  @Action({ rawError: true })
  async fetchFields() {
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.query({
      query: gql`
        query getFields {
          career_fields {
            id
            name
          }
        }
      `
    });
    this.updateCareer({ key: "fields", value: data.career_fields });
    return data.career_fields || [];
  }

  @Action({ rawError: true })
  async fetchGroups(field_id) {
    const query = gql`
      query getGroups($field_id: Int!) {
        career_groups(where: { career_field: { id: { _eq: $field_id } } }) {
          id
          name
        }
      }
    `;
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.query({
      query: query,
      variables: {
        field_id: field_id
      }
    });
    this.updateCareer({ key: "groups", value: data.career_groups });
    return data.career_groups;
  }

  @Action({ rawError: true })
  async fetchPositions(group_id) {
    const query = gql`
      query getGroups($group_id: Int!) {
        career_positions(where: { career_group: { id: { _eq: $group_id } } }) {
          id
          name
          name_th
          desc
          tasks
        }
      }
    `;
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.query({
      query: query,
      variables: {
        group_id: group_id
      }
    });
    this.updateCareer({ key: "positions", value: data.career_positions });
    return data.career_positions;
  }

  @Action({ rawError: true })
  async fetchSkills(skill_id) {
    const query = gql`
      query getGroups($skill_id: Int!) {
        skills(
          where: {
            position_m_skills: { career_position: { id: { _eq: $skill_id } } }
          }
          order_by: { position_m_skills_aggregate: { count: desc } }
        ) {
          id
          name
          name_th
          desc
          ability
          position_m_skills_aggregate {
            aggregate {
              count
            }
          }
        }
      }
    `;
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.query({
      query: query,
      variables: {
        skill_id: skill_id
      }
    });

    let transform = data;

    if (data.skills[0].position_m_skills_aggregate) {
      transform = data.skills.map(item => {
        item.amount = item.position_m_skills_aggregate.aggregate.count;
        delete item.position_m_skills_aggregate;
        return item;
      });
    }
    this.updateCareer({ key: "skills", value: transform });
    return transform;
  }
}

interface UpdateCareer {
  key: string;
  value: string;
}
