<template>
  <div>
    <div class="flex w-full items-end">
      <change-view :active-overview="activeOverview" class="mb-3" @change-view="changeView($event)"></change-view>
      <chart-criteria
          :active-overview="activeOverview"
          :range="range"
          :wallet-id="walletId"
          @change-wallet="walletId=$event"
          @change-range="range=$event"
      ></chart-criteria>
    </div>
    <report-overview
        :active-overview="activeOverview"
        :range="range"
        :transactions="transactions"
    ></report-overview>
    <div class="mt-5 flex justify-center items-center w-full h-full">
      <pie-chart
          :active-overview="activeOverview"
          :range="range"
          :transactions="transactions"
          :title="$t('report.incomeCategory')"
          type="income"
      ></pie-chart>
      <pie-chart
          :active-overview="activeOverview"
          :range="range"
          :transactions="transactions"
          :title="$t('report.expenseCategory')"
          type="expense"
      ></pie-chart>
    </div>
  </div>
</template>

<script>
import ReportOverview from "@/components/layout/ReportOverview";
import ChangeView from "@/components/ui/ChangeView";
import PieChart from "@/components/chart/PieChart";
import * as dayjs from "dayjs";
import {mapGetters} from "vuex";
import {transactionStore} from "@/plugin/db";
import * as isLeapYear from 'dayjs/plugin/isLeapYear';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import ChartCriteria from "@/components/layout/ChartCriteria";

dayjs.extend(weekOfYear)
dayjs.extend(isLeapYear)

export default {
  data() {
    const walletId = this.$store.getters["userModule/user"].data.selectedWallet;
    return {
      transactions: [],
      range: 0,
      activeOverview: "month",
      walletId,
    }
  },
  computed: {
    ...mapGetters({
      user: "userModule/user"
    }),
    startRange() {
      if (this.activeOverview === "week") return dayjs().week(this.range + 1).startOf("week").toDate()
      return dayjs().set(this.activeOverview, this.range).startOf(this.activeOverview).toDate();
    },
    endRange() {
      if (this.activeOverview === "week") return dayjs().week(this.range + 1).endOf("week").toDate()
      return dayjs().set(this.activeOverview, this.range).endOf(this.activeOverview).toDate();
    },
  },
  watch: {
    range: {
      immediate: true,
      handler: function () {
        this.fetchTransaction();
      }
    },
    walletId: {
      immediate: true,
      handler: function () {
        this.fetchTransaction()
      }
    },
    activeOverview: {
      immediate: true,
      handler: function (view) {
        switch (view) {
          case "week":
            this.range = dayjs().week() - 1;
            break;
          case "month":
            this.range = dayjs().month();
            break;
          case "year":
            this.range = dayjs().year();
            break;
        }
      }
    }
  },
  components: {
    ChartCriteria,
    ReportOverview,
    ChangeView,
    PieChart,
  },
  methods: {
    changeView(view) {
      this.activeOverview = view
    },
    async fetchTransaction() {
      await this.$bind(
          "transactions",
          transactionStore
              .where("uid", "==", this.user.data.uid)
              .where("wallet", "==", this.walletId)
              .where("time", "<=", this.endRange)
              .where("time", ">=", this.startRange)
      );
    },
  },
}
</script>