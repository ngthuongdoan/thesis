<template>
  <div>
    <app-modal
        v-if="isSubOpen"
        :is-category="this.modal==='category-modal'"
        @away="toggleSubModal"
    >
      <component
          :is="modal"
          @change-wallet="changeWallet($event)"
          @change-person="changePerson($event)"
          @change-category="changeCategory($event)"
      ></component>
    </app-modal>
    <form id="addForm" class="flex flex-col m-auto gap-3 px-7 py-5" @submit.prevent="addTransaction">
      <div class="flex flex-col justify-center items-center mb-4 gap-2">
        <label>
          <currency-input
              v-model="transaction.value"
              :currency="null"
              :precision="0"
              :value-as-integer="true"
              class="add-input text-4xl font-bold text-center m-0"
          />
        </label>
      </div>
      <div class="grid grid-cols-add items-end gap-y-2">
        <label class="font-bold self-start" for="note">{{ $t("note") }}</label>
        <textarea
            id="note"
            v-model="transaction.detail"
            class="add-input"
            rows="5"
        ></textarea>
        <label class="font-bold mt-2">{{ $t("wallet") }}</label>
        <div
            class="add-input " @click="toggleSubModal('transaction-wallet-modal')">
          {{ wallet.name || '' }}
        </div>
        <label class="font-bold mt-2">{{ $t("category") }}</label>
        <div class="add-input" @click="toggleSubModal('category-modal')">
          {{ transaction.category.name[$i18n.locale] || '' }}
        </div>
        <label class="font-bold mt-2" for="createdDate">{{ $t("date") }}</label>
        <input id="createdDate" v-model="tempDate" :max="maxDate" class="add-input" type="date"/>
        <label v-if="isDebtLoan" class="font-bold mt-2">{{ $t("person") }}</label>
        <div v-if="isDebtLoan" class="add-input" @click="toggleSubModal('person-modal')">{{
            transaction.person.name || ''
          }}
        </div>
      </div>

      <div class="flex w-full items-center justify-center gap-3">
        <input
            class="main-btn p-3 w-2/6"
            type="submit"
            :value="$t('create')">
        <button
            class="p-3 bg-gray-200 font-bold text-md w-2/6 cursor-pointer ease-in-out duration-100 transition-all"
            type="button"
            @click="$store.dispatch('modalModule/changeModal')">
          {{ $t("cancel") }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import AppModal from '@/components/modal/AppModal'
import CategoryModal from '@/components/modal/CategoryModal'
import PersonModal from '@/components/modal/PersonModal'
import Transaction from '@/model/Transaction.model'
import {Timestamp, walletStore} from '@/plugin/db'
import {Cropper} from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import {TransactionService} from '@/service/Transaction.service'
import TransactionWalletModal from '@/components/modal/TransactionWalletModal'
import {mapGetters} from 'vuex'
import * as dayjs from "dayjs"

export default {
  data() {
    return {
      transaction: new Transaction(),
      tempDate: '',
      wallets: [],
      wallet: {},
      modal: '',
      isSubOpen: false,
      isDebtLoan: false,
    }
  },
  computed: {
    ...mapGetters({
      isOpen: 'modalModule/isOpen',
    }),
    maxDate() {
      return dayjs().format('YYYY-MM-DD');
    }
  },
  watch: {
    'transaction.wallet'(newValue) {
      this.$bind('wallet', walletStore.doc(newValue))
    },
  },
  methods: {
    toggleSubModal(modal = '') {
      this.modal = modal
      this.isSubOpen = !this.isSubOpen
    },
    changeWallet(wallet) {
      this.transaction.wallet = wallet.id
      this.toggleSubModal()
    },
    changeCategory(category) {
      this.transaction.category = {id: category.id, ...category}
      this.isDebtLoan = this.$getConst('DEBT_LOAN_DICT').includes(category.type)
      this.toggleSubModal()
    },
    changePerson(person) {
      this.transaction.person = {id: person.id, ...person}
      this.toggleSubModal()
    },
    async addTransaction() {
      this.$helpers.loading()
      try {
        //Refined Data
        this.transaction.time = Timestamp.fromDate(new Date(Date.parse(this.tempDate)))
        this.transaction.value = Number.parseFloat(this.transaction.value) *
            (this.$getConst('INCREASE_DICT').includes(this.transaction.category.type) ? 1 : -1)

        if (this.$getConst('DEBT_DICT').includes(this.transaction.category.type)) {
          this.transaction.person.totalDebt += this.transaction.value
        } else if (this.$getConst('LOAN_DICT').includes(this.transaction.category.type)) {
          this.transaction.person.totalLoan += this.transaction.value
        }

        await TransactionService.addNew(this.transaction)
        this.$helpers.showSuccess()
        await this.$store.dispatch('modalModule/changeModal')
      } catch (e) {
        this.$helpers.showError(e)
      }
    },
  },
  components: {
    Cropper,
    AppModal,
    CategoryModal,
    TransactionWalletModal,
    PersonModal,
  },
}
</script>
