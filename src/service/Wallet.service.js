import Currency from "@/model/Currency.model";
import Wallet from "@/model/Wallet.model";
import {Timestamp, userStore, walletStore} from "@/plugin/db";
import store from "@/store";

export const WalletService = {
	async initOverviewWallet(uid) {
		const overview = new Wallet("Overview", 0, new Currency("VND", "Vietnam Dong"), "#1b1c6d", uid);
		return await this.addNew(overview);
	},
	async addNew(w) {
		return await walletStore.add({ createdDate: Timestamp.fromDate(new Date()), ...w });
	},
	async changeBackToOverView() {
		//Find Overview
		try {
			const uid = store.getters["userModule/user"].data.uid;
			const users = await userStore.doc(uid);
			const walletSnapshot = await walletStore.where("uid", "==", uid).where("name", "==", "Overview").limit(1).get();
			walletSnapshot.forEach(async (doc) => {
				const overviewWallet = await doc.data();
				await users.update({selectedWallet: {id: overviewWallet.id, ...overviewWallet}});
				await store.dispatch("userModule/changeSelected", overviewWallet);
			});
		} catch (e) {
			console.log(e);
		}
	},
	async delete(w) {
		return new Promise((resolve, reject) => {
			if (!(new RegExp("overview", "gi").test(w.name))) {
				const uid = store.getters["userModule/user"].data.uid;
				const walletsRef = walletStore.where("uid", "==", uid).where("name", "==", w.name).limit(1);
				walletsRef.get().then(querySnapshot => {
					querySnapshot.forEach(doc => {
						doc.ref.delete();
						this.changeBackToOverView().then(() => {
							resolve();
						});
					});
				});
			} else {
				reject(new Error("Not permit"));
			}
		});
	}
};