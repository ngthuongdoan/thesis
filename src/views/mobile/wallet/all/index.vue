<template>
  <div class="wallet-container w-screen min-h-screen h-full flex flex-col items-center pt-5">
    <wallet-card v-for="(wallet, i) in wallets" :key="wallet.id"
                 :show-setting="false"
                 :style="{zIndex:i, transform: `rotateY(10deg) translateY(${(i)*150}px) perspective(1px) !important`,
                  boxShadow:'1px 1px 70px black !important'}"
                 :wallet="wallet"
                 class="wallet w-2/3 absolute transform cursor-pointer"
                 @click.native="changeWallet(wallet)"
    ></wallet-card>
  </div>
</template>

<script>
import WalletCard from "@/components/ui/WalletCard";
import {userStore, walletStore} from "@/plugin/db";
import store from "@/store";

export default {
  data() {
    return {
      wallets: []
    };
  },
  methods: {
    async changeWallet(wallet) {
      try {
        const users = userStore.doc(this.$store.getters["userModule/user"].data.uid);
        this.$bind('users', users);
        await this.$firestoreRefs.users.update({selectedWallet: wallet.id});
        await this.$store.dispatch("userModule/changeSelected", wallet.id);
        await this.$router.push("/dashboard");
      } catch (e) {
        this.$helpers.showError(e)
      }
    }
  },
  components: {
    WalletCard
  },
  firestore() {
    const uid = store.getters["userModule/user"].data.uid;
    return {
      wallets: walletStore.where("uid", "==", uid)
    };
  }
};
</script>

<style lang="scss">
.wallet-container {
  background-image: url(~@/assets/img/wallet-container.svg);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>