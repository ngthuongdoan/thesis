<template>
  <ul v-on-click-away="away" class="bg-white text-black text-sm mt-2 block">
    <li
        v-for="opt in options"
        :key="opt.name"
        class="px-3 py-2 cursor-pointer"
        @click.stop="handleOption(opt.config)"
    >
      {{ $t(`walletOptions.${opt.name}`) }}
    </li>
  </ul>
</template>

<script>
import options from "@/config/wallet-options.json";
import {directive as onClickAway} from "vue-clickaway";
import {WalletService} from "@/service/Wallet.service";
import {isMobile} from "mobile-device-detect";
import store from "@/store"
import {walletStore} from "@/plugin/db";

export default {
  data() {
    return {
      options
    };
  },
  directives: {
    onClickAway
  },
  methods: {
    away() {
      this.$emit("away")
    },
    deleteWallet: async function () {
      const choose = await this.$helpers.confirmSwal();
      if (choose.isConfirmed) {
        this.$helpers.loading();
        try {
          await WalletService.delete(this.wallet);
          await this.$helpers.showSuccess();
        } catch (err) {
          await this.$helpers.showError(err);
        }
      }
    },
    handleOption(option) {
      if (!isMobile) {
        this.$store.dispatch("modalModule/changeModal", {modal: option.modal})
        this.away();
        return;
      }
      switch (Object.keys(option)[0]) {
        case "path":
          this.$router.push(option.path + this.wallet.id);
          break;
        case "tool":
          this.$router.push(option.tool)
          break;
        case "component":
          this.$store.dispatch("modalModule/changeModal", {modal: option.component + "Modal"})
          break;
        case "methods":
          this.deleteWallet();
          break;
        default:
          break;
      }
      this.away()
    }
  },
  firestore() {
    const wallet = store.getters["userModule/user"].data.selectedWallet;
    return {
      wallet: walletStore.doc()
    }
  }
};
</script>

<style scoped>

</style>