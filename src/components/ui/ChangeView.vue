<template>
  <div class="flex gap-3">
    <button :class="['btn ', activeOverview==='week'&&'btn-active main-btn']" @click="changeView('week')">
      {{ $t("report.week") }}
    </button>
    <button :class="['btn ', activeOverview==='month'&&'btn-active main-btn']" @click="changeView('month')">
      {{ $t("report.month") }}
    </button>
    <button :class="['btn ', activeOverview==='year'&&'btn-active main-btn']" @click="changeView('year')">
      {{ $t("report.year") }}
    </button>
  </div>
</template>
<script>
export default {
  name: 'change-view',
  props: {
    activeOverview: {
      type: String,
      validate(value) {
        return ["week", "month", "year"].includes(value);
      }
    }
  },
  methods: {
    changeView(view) {
      this.$emit("change-view", view)
    }
  }
}
</script>
