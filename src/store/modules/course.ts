import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import gql from "graphql-tag";
import { Subject } from "@/@types/course";
import { Skill } from "@/@types/skill";

@Module({
  name: "course",
  namespaced: true,
  stateFactory: true
})
export default class CourseStore extends VuexModule {
  public facultys = [{ name: "Empty facultys...", id: -1 }];
  public programs = [{ name: "Empty programs...", id: -1 }];
  public subjects: any = [new Subject()];
  public skills: Skill[] = [new Skill()];
  public skills_search: Skill[] = [new Skill()];

  /* --------------------------------- Getters -------------------------------- */
  get data() {
    return {
      facultys: this.facultys,
      programs: this.programs,
      subjects: this.subjects,
      skills: this.skills,
      skills_search: this.skills_search
    };
  }

  /* -------------------------------- Mutations -------------------------------- */
  @Mutation
  update(data: Update) {
    this[data.key] = data.value;
  }

  @Mutation
  updateIndex(data) {
    this[data.key][data.index] = data.value;
  }

  // @Mutation
  // reset() {
  //   this.facultys = [{ name: "Empty facultys...", id: -1 }];
  //   this.programs = [{ name: "Empty programs...", id: -1 }];
  //   this.subjects = [new Subject()];
  //   this.skills = [new Skill()];
  //   this.skills_search = [new Skill()];
  // }

  /* --------------------------------- Actions -------------------------------- */
  @Action({ rawError: true })
  async fetchCourse() {
    await this.fetchFaculty();
    await this.fetchProgram(this.facultys[0].id);
    await this.fetchSubject(this.programs[0].id || -1);
    await this.fetchSkill({ id: this.subjects[0].id || -1 });
    return Promise.resolve(true);
  }

  /* --------------------------------- Faculty -------------------------------- */

  // Query
  @Action({ rawError: true })
  async fetchFaculty() {
    const query = gql`
      query getFaculty {
        course_facultys(order_by: { name: asc }) {
          id
          name
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .query({
        query: query
      })
      .then(resp => {
        const data = resp.data.course_facultys;
        if (data.length) {
          this.update({
            key: "facultys",
            value: data.length ? data : [{ name: "Empty Faculty...", id: -1 }]
          });
        }
      });
  }

  // Insert
  @Action({ rawError: true })
  async insertFaculty(payload?) {
    const query = gql`
      mutation insertFaculty($name: String) {
        insert_course_facultys_one(object: { name: $name }) {
          id
          name
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(resp => {
        const data = resp.data.insert_course_facultys_one;
        this.update({ key: "facultys", value: [data, ...this.facultys] });
      });
  }

  // Update
  @Action({ rawError: true })
  async updateFaculty(payload?) {
    const query = gql`
      mutation updateFaculty($name: String, $where: Int) {
        update_course_facultys(
          _set: { name: $name }
          where: { id: { _eq: $where } }
        ) {
          returning {
            id
            name
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(() => {
        this.fetchFaculty();
      });
  }

  // Delete
  @Action({ rawError: true })
  async deleteFaculty(payload) {
    const query = gql`
      mutation deleteFaculty($id: Int) {
        delete_course_facultys(where: { id: { _eq: $id } }) {
          returning {
            id
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(() => {
        this.fetchFaculty();
      });
  }

  /* --------------------------------- Programs -------------------------------- */

  // Query
  @Action({ rawError: true })
  async fetchProgram(id) {
    const query = gql`
      query getProgram($id: Int!) {
        course_programs(where: { course_faculty: { id: { _eq: $id } } }) {
          id
          name
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .query({
        query: query,
        variables: {
          id: id
        }
      })
      .then(resp => {
        const data = resp.data.course_programs;
        this.update({
          key: "programs",
          value: data.length ? data : [{ name: "Empty programs...", id: -1 }]
        });
      });
  }

  // Insert
  @Action({ rawError: true })
  async insertProgram(payload?) {
    const query = gql`
      mutation insertProgram($name: String, $course_faculty_id: Int) {
        insert_course_programs_one(
          object: { name: $name, course_faculty_id: $course_faculty_id }
        ) {
          id
          name
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(resp => {
        const data = resp.data.insert_course_programs_one;
        this.update({
          key: "programs",
          value: this.programs[0]?.id < 0 ? [data] : [data, ...this.programs]
        });
      });
  }

  // Update Program
  @Action({ rawError: true })
  async updateProgram(payload?) {
    const query = gql`
      mutation updateProgram($name: String, $where: Int) {
        update_course_programs(
          _set: { name: $name }
          where: { id: { _eq: $where } }
        ) {
          returning {
            id
            name
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(() => {
        this.fetchCourse();
      });
  }

  // Delete Program
  @Action({ rawError: true })
  async deleteProgram(payload) {
    const query = gql`
      mutation deleteProgram($id: Int) {
        delete_course_programs(where: { id: { _eq: $id } }) {
          returning {
            id
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(async resp => {
        const updateData = this.programs.filter(item => item.id !== payload.id);
        if (updateData.length) {
          this.update({ key: "programs", value: updateData });
        } else {
          this.update({
            key: "programs",
            value: [{ name: "Empty Program...", id: -1 }]
          });
        }
        return resp;
      });
  }

  /* -------------------------------- Subjects -------------------------------- */
  @Action({ rawError: true })
  async fetchSubject(id) {
    const query = gql`
      query getSubject($id: Int!) {
        course_subjects(where: { course_program: { id: { _eq: $id } } }) {
          id
          name
          name_th
          desc
          subject_id
          course_program_id
        }
      }
    `;
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.query({
      query: query,
      variables: {
        id: id
      }
    });
    this.update({
      key: "subjects",
      value: data.course_subjects.length
        ? data.course_subjects
        : [{ name: "Empty Subject...", id: -1 }]
    });
    return data.course_subjects;
  }
  @Action({ rawError: true })
  async insertSubject(payload) {
    const query = gql`
      mutation insertSubject(
        $name: String
        $name_th: String
        $subject_id: String
        $desc: String
        $course_program_id: Int
      ) {
        insert_course_subjects_one(
          object: {
            name: $name
            name_th: $name_th
            subject_id: $subject_id
            desc: $desc
            course_program_id: $course_program_id
          }
        ) {
          id
          name
          name_th
          desc
          subject_id
          course_program_id
        }
      }
    `;
    payload.subject_id = payload.subject_id.toString();
    const { data } = await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(async resp => {
        const data = resp.data.insert_course_subjects_one;
        this.update({
          key: "subjects",
          value: this.subjects[0].id < 0 ? [data] : [data, ...this.subjects]
        });
        return resp;
      });
    return data.insert_course_subjects_one;
  }

  // Update Subject
  @Action({ rawError: true })
  async updateSubject(payload) {
    const query = gql`
      mutation updateSubject(
        $id: Int
        $name: String
        $name_th: String
        $desc: String
        $subject_id: String
      ) {
        update_course_subjects(
          _set: {
            name: $name
            name_th: $name_th
            desc: $desc
            subject_id: $subject_id
          }
          where: { id: { _eq: $id } }
        ) {
          returning {
            id
            name
            name_th
            desc
            subject_id
          }
        }
      }
    `;
    payload.subject_id = payload.subject_id.toString();
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.mutate({
      mutation: query,
      variables: payload
    });
    const resp = data.update_course_subjects.returning[0];
    return resp;
  }

  // Delete Subject
  @Action({ rawError: true })
  async deleteSubject(payload) {
    const query = gql`
      mutation deleteSubject($id: Int) {
        delete_course_subjects(where: { id: { _eq: $id } }) {
          returning {
            id
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(async resp => {
        const updateData = this.subjects.filter(item => item.id !== payload.id);
        if (updateData.length) {
          this.update({ key: "subjects", value: updateData });
        } else {
          this.update({
            key: "subjects",
            value: [{ name: "Empty Subjects...", id: -1 }]
          });
        }
        return Promise.resolve(resp);
      });
  }

  /* ---------------------------------- Skill --------------------------------- */
  @Action({ rawError: true })
  async fetchSkill(payload) {
    const query = gql`
      query getSkill($id: Int!) {
        skills(
          where: { subject_m_skills: { course_subject: { id: { _eq: $id } } } }
        ) {
          id
          name
          name_th
          desc
          ability
          type
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .query({
        query: query,
        variables: payload
      })
      .then(resp => {
        const data = resp.data.skills;
        this.update({
          key: "skills",
          value: data.length ? data : [new Skill()]
        });
      });
  }

  @Action({ rawError: true })
  async searchSkill(payload) {
    const query = gql`
      query searchSkill($name: String) {
        skills(where: { name: { _like: $name } }, limit: 30) {
          desc
          ability
          id
          name_th
          name
          type
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .query({
        query: query,
        variables: payload
      })
      .then(resp => {
        // update skill store
        this.update({
          key: "skills_search",
          value: resp.data.skills.length ? resp.data.skills : [new Skill()]
        });
      });
  }

  // Append exist skill
  @Action({ rawError: true })
  async appendSkill(payload) {
    const query = gql`
      mutation appendSkill($subject_id: Int, $skill_id: Int) {
        insert_subject_m_skill_one(
          object: { subject_id: $subject_id, skill_id: $skill_id }
        ) {
          skill {
            id
            name
            name_th
            desc
            ability
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(resp => {
        // update skill store
        const data = resp.data.insert_subject_m_skill_one.skill;
        this.update({
          key: "skills",
          value: [data, ...this.skills]
        });

        return Promise.resolve(data);
      });
  }

  // Add new skill
  @Action({ rawError: true })
  async addSkill(payload) {
    const query = gql`
      mutation addSkill(
        $subject_id: Int
        $name: String
        $name_th: String
        $desc: String
        $type: String
        $ability: _varchar
      ) {
        insert_subject_m_skill_one(
          object: {
            subject_id: $subject_id
            skill: {
              data: {
                name: $name
                name_th: $name_th
                desc: $desc
                type: $type
                ability: $ability
              }
            }
          }
        ) {
          id
          skill {
            id
            name
            name_th
            desc
            type
            ability
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(resp => {
        // update skill store
        const data = resp.data.insert_subject_m_skill_one.skill;
        this.update({
          key: "skills",
          value: [data, ...this.skills]
        });

        return Promise.resolve(data);
      });
  }

  // Update Skill
  @Action({ rawError: true })
  async updateSkill(payload) {
    const query = gql`
      mutation updateSkill(
        $id: Int
        $name: String
        $name_th: String
        $desc: String
        $type: String
        $ability: _varchar
      ) {
        update_skills(
          _set: {
            name: $name
            name_th: $name_th
            desc: $desc
            type: $type
            ability: $ability
          }
          where: { id: { _eq: $id } }
        ) {
          returning {
            id
            name
            name_th
            desc
            type
            ability
          }
        }
      }
    `;
    const { data } = await Vue.prototype.$apolloProvider.defaultClient.mutate({
      mutation: query,
      variables: payload
    });
    const resp = data.update_skills.returning[0];
    return resp;
  }

  // Delete Skill
  @Action({ rawError: true })
  async deleteSkill(payload) {
    const query = gql`
      mutation deleteSkill($skill_id: Int, $subject_id: Int) {
        delete_subject_m_skill(
          where: {
            skill_id: { _eq: $skill_id }
            subject_id: { _eq: $subject_id }
          }
        ) {
          returning {
            skill {
              id
            }
          }
        }
      }
    `;
    await Vue.prototype.$apolloProvider.defaultClient
      .mutate({
        mutation: query,
        variables: payload
      })
      .then(async resp => {
        const affectData = resp.data.delete_subject_m_skill.returning[0].skill;
        const updateData = this.skills.filter(
          item => item.id !== affectData.id && item.id !== -1
        );
        if (updateData.length) {
          this.update({ key: "skills", value: updateData });
        } else {
          this.update({
            key: "skills",
            value: [new Skill()]
          });
        }
        return Promise.resolve(resp);
      });
  }
}
