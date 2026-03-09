<template>
  <view class="shop-container">
    <!-- 商店头部 -->
    <view class="shop-header">
      <view class="coin-display">
        <text class="coin-icon">💰</text>
        <text class="coin-amount">{{ userCoins }}</text>
      </view>
      <text class="shop-title">宠物商店</text>
    </view>

    <!-- 商品分类 -->
    <view class="category-tabs">
      <view
        v-for="category in displayCategories"
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        @click="switchCategory(category.id)"
      >
        <text class="category-icon">{{ category.icon }}</text>
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <scroll-view v-if="activeCategory !== 'inventory'" class="products-list" scroll-y="true">
      <view
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        @click="showProductDetail(product)"
      >
        <view class="product-image">
          <text class="product-emoji">{{ product.emoji }}</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-desc">{{ product.description }}</text>
          <view class="product-price">
            <text class="coin-icon-small">💰</text>
            <text class="price-amount">{{ product.price }}</text>
          </view>
        </view>
        <view class="buy-button" @click.stop="buyProduct(product)">
          <text class="buy-text">购买</text>
        </view>
      </view>
    </scroll-view>

    <!-- 背包 -->
    <scroll-view v-else class="inventory-list" scroll-y="true">
      <view class="inventory-header">
        <text class="inventory-title">我的背包</text>
        <view class="pet-picker" v-if="pets.length">
          <text class="picker-label">使用目标：</text>
          <view class="pet-chips">
            <view
              v-for="pet in pets"
              :key="pet.id"
              class="pet-chip"
              :class="{ active: selectedPetId === pet.id }"
              @click="selectedPetId = pet.id"
            >
              <text class="chip-emoji">{{ pet.emoji }}</text>
              <text class="chip-name">{{ pet.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="inventory.length === 0" class="empty-inventory">
        <text class="empty-emoji">🎒</text>
        <text class="empty-text">背包空空如也，去商店逛逛吧</text>
      </view>

      <view
        v-for="item in inventory"
        :key="item.id"
        class="product-card inventory-card"
      >
        <view class="product-image">
          <text class="product-emoji">{{ item.emoji }}</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-desc">{{ item.effect }}</text>
          <view class="product-price">
            <text class="coin-icon-small">📦</text>
            <text class="price-amount">x{{ item.quantity }}</text>
          </view>
        </view>
        <view class="buy-button" @click.stop="useItem(item)" :class="{ disabled: !selectedPetId }">
          <text class="buy-text">{{ selectedPetId ? '使用' : '请选择宠物' }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- 商品详情弹窗 -->
    <view v-if="showDetail" class="detail-modal" @click="hideDetail">
      <view class="detail-content" @click.stop>
        <view class="detail-header">
          <text class="detail-emoji">{{ selectedProduct?.emoji }}</text>
          <text class="detail-name">{{ selectedProduct?.name }}</text>
          <view class="close-btn" @click="hideDetail">✕</view>
        </view>
        <text class="detail-description">{{ selectedProduct?.description }}</text>
        <view class="detail-effect">
          <text class="effect-title">效果：</text>
          <text class="effect-desc">{{ selectedProduct?.effect }}</text>
        </view>
        <view class="detail-price">
          <text class="coin-icon-small">💰</text>
          <text class="price-amount">{{ selectedProduct?.price }}</text>
        </view>
        <view class="detail-buttons">
          <button class="cancel-btn" @click="hideDetail">取消</button>
          <button class="confirm-btn" @click="confirmBuy">确认购买</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { shopAPI, petAPI } from '@/services/api'

const route = useRoute()
const categories = ref<any[]>([])
const products = ref<any[]>([])
const inventory = ref<any[]>([])
const pets = ref<any[]>([])
const authStore = useAuthStore()
const activeCategory = ref('food')
const showDetail = ref(false)
const selectedProduct = ref<any>(null)
const userCoins = computed(() => authStore.userInfo?.coins ?? 0)
const selectedPetId = ref<number | null>(null)

const displayCategories = computed(() => {
  return [...categories.value, { id: 'inventory', name: '背包', icon: '🎒' }]
})

// 计算属性
const filteredProducts = computed(() => {
  return products.value.filter(product => product.category === activeCategory.value)
})

// 方法
const switchCategory = async (categoryId: string) => {
  activeCategory.value = categoryId
  if (categoryId === 'inventory') {
    await loadInventory()
    await loadPets()
  } else {
    await loadProducts()
  }
}

const showProductDetail = (product: any) => {
  selectedProduct.value = product
  showDetail.value = true
}

const hideDetail = () => {
  showDetail.value = false
  selectedProduct.value = null
}

const buyProduct = (product: any) => {
  showProductDetail(product)
}

const confirmBuy = async () => {
  if (!selectedProduct.value) return
  const userId = authStore.userId || 1
  const product = selectedProduct.value
  try {
    const res = await shopAPI.buy(userId, product.id, 1)
    authStore.updateCoins(-(res.cost || product.price))
    uni.showToast({
      title: `购买成功！获得 ${product.name}`,
      icon: 'success',
      duration: 2000
    })
    hideDetail()
  } catch (err: any) {
    uni.showToast({
      title: err?.error || '金币不足',
      icon: 'error',
      duration: 2000
    })
  }
}

const loadCategories = async () => {
  const data = await shopAPI.categories()
  categories.value = data || []
  if (!categories.value.find(c => c.id === activeCategory.value)) {
    activeCategory.value = categories.value[0]?.id || 'food'
  }
}

const loadProducts = async () => {
  const data = await shopAPI.products(activeCategory.value)
  products.value = data || []
}

const loadInventory = async () => {
  const userId = authStore.userId || 1
  const data = await shopAPI.inventory(userId)
  inventory.value = data || []
}

const loadPets = async () => {
  const userId = authStore.userId || 1
  const list = await petAPI.listPetsByUser(userId)
  const emojiMap: any = { dog: '🐶', cat: '🐱', rabbit: '🐰', hamster: '🐹', parrot: '🦜', fish: '🐠' }
  pets.value = (list || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    emoji: emojiMap[p.type] || '🐾'
  }))
  selectedPetId.value = pets.value[0]?.id || null
}

const useItem = async (item: any) => {
  if (!selectedPetId.value) return
  const userId = authStore.userId || 1
  try {
    const res = await shopAPI.use(userId, item.id, selectedPetId.value)
    item.quantity -= 1
    if (item.quantity <= 0) {
      inventory.value = inventory.value.filter(i => i.id !== item.id)
    }
    uni.showToast({ title: res?.message || '使用成功', icon: 'success' })
  } catch (err: any) {
    uni.showToast({ title: err?.error || '使用失败', icon: 'error' })
  }
}

onMounted(async () => {
  try {
    const tab = typeof route.query.tab === 'string' ? route.query.tab : ''
    if (tab) activeCategory.value = tab
    await loadCategories()
    if (activeCategory.value === 'inventory') {
      await loadInventory()
      await loadPets()
    } else {
      await loadProducts()
    }
  } catch (err) {
    uni.showToast({ title: '加载商店失败', icon: 'error' })
  }
})
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  background: radial-gradient(900px 500px at 10% 0%, rgba(255, 209, 102, 0.25), transparent 60%),
              radial-gradient(700px 500px at 90% 10%, rgba(63, 193, 201, 0.2), transparent 60%),
              var(--bg-base);
  padding-bottom: 20px;
}

.shop-header {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 20px 20px;
  box-shadow: var(--shadow);
}

.coin-display {
  display: flex;
  align-items: center;
  background: linear-gradient(45deg, var(--accent-sun), #ffe08a);
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.coin-icon {
  font-size: 18px;
  margin-right: 5px;
}

.coin-amount {
  font-weight: bold;
  color: #333;
}

.shop-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-primary);
}

.category-tabs {
  display: flex;
  padding: 20px 15px 10px;
  gap: 10px;
  overflow-x: auto;
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  min-width: 70px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-tab.active {
  background: linear-gradient(45deg, var(--accent-mint), #3aafa9);
  color: white;
  transform: scale(1.05);
}

.category-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.category-name {
  font-size: 12px;
  font-weight: 500;
}

.products-list {
  height: calc(100vh - 200px);
  padding: 0 15px;
}

.inventory-list {
  height: calc(100vh - 200px);
  padding: 0 15px;
}

.inventory-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 6px 0 14px;
}

.inventory-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.pet-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.picker-label {
  font-size: 12px;
  color: var(--text-muted);
}

.pet-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.pet-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.05);
}

.pet-chip.active {
  background: linear-gradient(45deg, var(--accent-mint), #3aafa9);
  color: white;
}

.chip-emoji {
  font-size: 14px;
}

.chip-name {
  font-size: 12px;
  font-weight: 600;
}

.empty-inventory {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: var(--text-muted);
}

.empty-emoji {
  font-size: 36px;
  margin-bottom: 8px;
}

.inventory-card .buy-button.disabled {
  opacity: 0.6;
}

.product-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 12px;
  padding: 15px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 2px solid var(--stroke);
  transition: all 0.3s ease;
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ff9a8b, #ff6b6b);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.product-emoji {
  font-size: 28px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 4px;
}

.product-desc {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.product-price {
  display: flex;
  align-items: center;
}

.coin-icon-small {
  font-size: 14px;
  margin-right: 3px;
}

.price-amount {
  font-weight: bold;
  color: var(--accent-coral);
}

.buy-button {
  background: linear-gradient(45deg, var(--accent-mint), #3aafa9);
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.buy-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-content {
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.detail-emoji {
  font-size: 40px;
  margin-right: 15px;
}

.detail-name {
  font-size: 20px;
  font-weight: bold;
  flex: 1;
}

.close-btn {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.detail-description {
  color: #666;
  margin-bottom: 15px;
  display: block;
}

.detail-effect {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.effect-title {
  font-weight: bold;
  color: #333;
}

.effect-desc {
  color: #666;
  font-size: 14px;
}

.detail-price {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.detail-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: 25px;
  font-weight: bold;
  border: none;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
}

.confirm-btn {
  background: linear-gradient(45deg, var(--accent-mint), #3aafa9);
  color: white;
}
</style>
