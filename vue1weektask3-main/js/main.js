let eventBus = new Vue()
function fixStar(a,b) {
    this.card.sort((a, b) => {
            return b.star - a.star
    })
}
// 11 10 24 2 3 1 22
// 1 10 11 2 22 24 3
Vue.component('notes', {
    template: `
   <div>
   <h1>Kanban</h1>
       <div class="_notes">
            <add-notes/>
         <p class="error" v-for="error in errors">{{ error }}</p>
       </div>
       
       <div class="column_notes">
       
        <div class="note_list_1_column">
        <h2>Запланированные задачи</h2>
             <note-list1 :note_list1="note_list1"></note-list1> 
        </div>
        
        <div class="note_list_2_column">
        <h2>Задачи в работе</h2>
             <note-list2   :note_list2="note_list2"></note-list2> 
        </div>
        <div class="note_list_3_column">
        <h2>Тестирование</h2>
             <note-list3  :note_list3="note_list3"></note-list3> 
        </div>
        <div class="note_list_4_column">
        <h2>Выполненные задачи</h2>
             <note-list4   :note_list4="note_list4"></note-list4> 
        </div>
        
        </div>
        
  </div>
 `,

    data() {
        return {
            note_list1: [],
            note_list2: [],
            note_list3: [],
            note_list4: [],
            errors: [],
            sortByYear: false
        }
    },
    methods: {



    },

    computed: {

    },

    mounted() {
        eventBus.$on('addColumn_1', card => {
            this.note_list1.push(card)
        })
        eventBus.$on('addColumn_2', card => {
            this.note_list2.push(card)
        })
        eventBus.$on('addColumn_3', card => {
            this.note_list3.push(card)
        })
        eventBus.$on('addColumn_4', card => {
            this.note_list4.push(card)

            if (card.date > card.deadline) {
                card.period = false
            }
        })

    },
    props: {
        card: {
            type: Object,
        },

    },


})


Vue.component('add-notes', {
    template: `
<section>
    <a href="#openModal" class="btn btnModal">Создать карточку</a>
    <div id="openModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Название</h3>
            <a href="#close" title="Close" class="close">×</a>
          </div>
          <div class="modal-body">    
        <div class="addForm">
            <form @submit.prevent="onSubmit">
                <div class="form__control">
                    <div class="form__name field">
                        <input id="point" required v-model="name" type="text" placeholder="Название">
                    </div>
                <div class="field">
                    <textarea required id="point" v-model="description" placeholder="Описание"> </textarea>
                </div>
                <div>
                    <p>Выберите сколько звезд, хотите дать заметке 1-3</p>
                    <input required  id="point" v-model="star">
                </div>
                <div class="field">
                    <input required type="date" id="point" v-model="deadline">
                </div>
                <button type="submit" class="btn">Добавить</button>
                </div>
            </form>
        </div>
              </div>
        </div>
      </div>
    </div>
    </section>
 `,

    data() {
        return {
            name: null,
            description: null,
            date: null,
            deadline: null,
            star: null
        }
    },
    methods: {
        onSubmit() {
            let card = {
                name: this.name,
                description: this.description,
                date: new Date().toLocaleDateString().split(".").reverse().join("-"),
                deadline: this.deadline,
                reason: [],
                transfer: false,
                edit: false,
                editDate: null,
                period: true,
                star: this.star
            }
            eventBus.$emit('addColumn_1', card)
            this.name = null
            this.description = null
            this.date = null
            this.deadline = null
            this.star = null
            },

        },

    computed: {

    },

    props: {
        note_list1:{
            type: Array,
            required: false,
        },
    },
    mounted() {
    }
})

Vue.component('note-list1', {
    template: `
<div class="note_list1__">
        <section id="main" class="main-alt">
                <div class="column column__one">
                    <div class="card" v-for="card in note_list1">
                       <a @click="deleteCard(card)" style="color: red">Удалить</a>  <a @click="card.edit = true" style="color: green">Редактировать</a>
                       <div class="tasks">Название: {{ card.name }}</div>
                        <div class="star">Важность: {{ card.star }}</div>
                        <div class="tasks">Описание: {{ card.description }}</div>
                        <div class="tasks">Дата создания: {{ card.date }}</div>
                        <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                        <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                                         <a @click="nextColumn(card)" style="color: mediumblue" >Следующая колонка</a>
                        <div class="tasks" v-if="card.edit">
                            <form @submit.prevent="updateTask(card)">
                                <p>Новое название: 
                                    <input type="text" v-model="card.name" placeholder="Название">
                                </p>
                                <p>Новое описание: 
                                    <textarea v-model="card.description"></textarea>
                                </p>
                                <p>
                                    <input type="submit" class="btn" value="Изменить карточку">
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
</div>
 `,

    data() {
        return {}
    },
    methods: {
        nextColumn(card) {
            this.note_list1.splice(this.note_list1.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
            this.note_list1.sort(fixStar);
        },
        deleteCard(card) {
            this.note_list1.splice(this.note_list1.indexOf(card), 1)

        },
        updateTask(card) {
            card.edit = false
            this.note_list1.push(card)
            this.note_list1.splice(this.note_list1.indexOf(card), 1)
            card.editDate = new Date().toLocaleString()
        },
    },
    computed: {
    },
    props: {
        note_list1: {
            type: Array,
        },
        note_list2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        },
        fixStar: {
            type: Function
        },
        sortByYear: {
        type: Boolean
        },
    }


})

Vue.component('note-list2', {
    template: `
<div  class="note_list2__">
         <section id="main" class="main-alt">
                <div class="column column__two">
                    <div class="card" v-for="card in note_list2">
                       <a @click="card.edit = true" style="color: green">Редактировать</a>
                       <div class="tasks">Название: {{ card.name }}</div>
                       <div class="star">Важность: {{ card.star }}</div>
                        <div class="tasks">Описание: {{ card.description }}</div>
                        <div class="tasks">Дата создания: {{ card.date }}</div>
                        <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                        <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                        <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                        <a @click="nextColumn(card)" style="color: mediumblue">Следующая колонка</a>
                        <div class="tasks" v-if="card.edit">
                            <form @submit.prevent="updateTask(card)">
                                <p>Новое название: 
                                    <input type="text" v-model="card.name" placeholder="Название">
                                </p>
                                <p>Новое описание: 
                                    <textarea v-model="card.description"></textarea>
                                </p>
                                <p>
                                    <input type="submit" class="btn" value="Изменить карточку">
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
 </div> 
 `,

    data() {
        return {}
    },
    methods: {
        nextColumn(card) {
            this.note_list2.splice(this.note_list2.indexOf(card), 1)
            eventBus.$emit('addColumn_3', card)
            this.note_list2.sort();

        },
        updateTask(card) {
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.note_list2.push(card)
            this.note_list2.splice(this.note_list2.indexOf(card), 1)
        }
    },

    computed: {},

    props: {
        note_list2: {
            type: Array,
        },
        card: {
            type: Object,
        },
    }
})
Vue.component('note-list3', {
    template: `
<div>
            <section id="main" class="main-alt">
            <div class="column column__three">

                <div class="card" v-for="card in note_list3">
                   <a @click="card.edit = true" style="color: green">Редактировать</a>
                   <div class="tasks">Название: {{ card.name }}</div>
                   <div class="star">Важность: {{ card.star }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                    <div class="tasks" v-if="card.reason.length">Причина переноса: <p v-for="reason in card.reason">{{ reason }}</p></div>
                    <div class="tasks" v-if="card.editDate != null">Последнее изменение: {{ card.editDate }}</div>
                    <a @click="card.transfer = true" style="color: mediumblue">Предыдущая колонка</a><br>
                    <a @click="nextColumn(card)" style="color: mediumblue">Следующая колонка</a>
                    <div class="tasks" v-if="card.edit">
                        <form @submit.prevent="updateTask(card)">
                            <p style="font-size: ">Новое название: 
                                <input type="text" v-model="card.name" placeholder="Название">
                            </p>
                            <p>Новое описание: 
                                <textarea v-model="card.description"></textarea>
                            </p>
                            <p>
                                <input type="submit" class="btn" value="Изменить карточку">
                            </p>
                        </form>
                    </div>
                    <div class="tasks" v-if="card.transfer">
                        <form @submit.prevent="lastColumn(card)">
                            <p>Причина переноса:
                                <input type="text" id="reasonInput">
                            </p>
                            <p>
                                <input type="submit" value="Перенос">
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
</div>

 `,

    data() {
        return {}
    },
    methods: {
        nextColumn(card) {
            this.note_list3.splice(this.note_list3.indexOf(card), 1)
            eventBus.$emit('addColumn_4', card)
            this.note_list3.sort();
            console.log(this.note_list3)
        },
        lastColumn(card) {
            let reasonValue = document.getElementById('reasonInput').value;
            card.reason.push(reasonValue)
            card.transfer = false
            this.note_list3.splice(this.note_list3.indexOf(card), 1)
            eventBus.$emit('addColumn_2', card)
        },
        updateTask(card){
            card.editDate = new Date().toLocaleString()
            card.edit = false
            this.note_list3.push(card)
            this.note_list3.splice(this.note_list3.indexOf(card), 1)
        }
    },

    computed: {},

    props: {
        note_list3: {
            type: Array,
        },
        card: {
            type: Object
        },

    }
})
Vue.component('note-list4', {
    template: `
<div>
           <section id="main" class="main-alt">
            <div class="column column__four">
                <div class="card" v-for="card in note_list4">
                    <div class="tasks">Название: {{ card.name }}</div>
                    <div class="star">Важность: {{ card.star }}</div>
                    <div class="tasks">Описание: {{ card.description }}</div>
                    <div class="tasks">Дата создания: {{ card.date }}</div>
                    <div class="tasks">Крайний срок: {{ card.deadline }}</div>
                        <div class="tasks" v-if="card.period" style="color: green">Завершено вовремя</div>
                        <div class="tasks" v-else style="color: red">Завершено не вовремя</div>
                </div>
            </div>
        </section> 
</div>

 `,

    data() {
        return {}
    },
    methods: {},

    computed: {},

    props: {
        note_list4: {
            type: Array,
        },
        card: {
            type: Object
        }
    }
})


new Vue({
    el: '#app',
    data: {},
})



