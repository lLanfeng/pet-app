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
            <text class="price-amount">💰 {{ product.price }}</text>
          </view>
        </view>
        <view class="buy-button" @click.stop="buyProduct(product)">
          <text class="buy-text">购买</text>
        </view>
      </view>
    </scroll-view>

    <!-- 背包 -->
    <scroll-view v-else class="products-list" scroll-y="true">
      <view class="inventory-header">
        <text class="inventory-title">我的背包</text>
      </view>
      <view v-if="inventory.length === 0" class="empty-inventory">
        <text class="empty-emoji">🎒</text>
        <text class="empty-text">背包空空如也</text>
      </view>
      <view
        v-for="item in inventory"
        :key="item.id"
        class="product-card"
      >
        <view class="product-image">
          <text class="product-emoji">{{ item.emoji }}</text>
        </view>
        <view class="product-info">
          <text class="product-name">{{ item.name }}</text>
          <text class="product-desc">{{ item.effect }}</text>
          <view class="product-price">
            <text class="price-amount">x{{ item.quantity }}</text>
          </view>
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
          <text class="price-amount">💰 {{ selectedProduct?.price }}</text>
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

const filteredProducts = computed(() => {
  return products.value.filter(product => product.category === activeCategory.value)
})

const switchCategory = async (categoryId: string) => {
  activeCategory.value = categoryId
  if (categoryId === 'inventory') {
    await loadInventory()
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
    uni.showToast({ title: `购买成功！`, icon: 'success' })
    hideDetail()
  } catch (err: any) {
    uni.showToast({ title: err?.error || '金币不足', icon: 'error' })
  }
}

const loadCategories = async () => {
  const data = await shopAPI.categories()
  categories.value = data || []
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

onMounted(async () => {
  try {
    await loadCategories()
    await loadProducts()
  } catch (err) {
    uni.showToast({ title: '加载商店失败', icon: 'error' })
  }
})
</script>

<style scoped>
.shop-container {
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 40px;
}

/* 头部 */
.shop-header {
  background: var(--primary);
  padding: 50px 16px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.coin-display {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: var(--radius-full);
}

.coin-icon {
  font-size: 14px;
  margin-right: 4px;
}

.coin-amount {
  font-weight: 600;
  color: #fff;
  font-size: 13px;
}

.shop-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

/* 分类 */
.category-tabs {
  display: flex;
  padding: 12px 16px;
  gap: 8px;
  overflow-x: auto;
  background: var(--bg-card);
  margin: 12px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.category-tab {
  display: flex;
  align-items: center;
  padding: 8px 14px;
  background: var(--bg-gray);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.category-tab.active {
  background: var(--primary);
}

.category-icon {
  font-size: 14px;
  margin-right: 4px;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
}

/* 列表 */
.products-list {
  padding: 0 16px;
}

.inventory-header {
  padding: 8px 0 12px;
}

.inventory-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.empty-inventory {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

.empty-emoji {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
}

/* 商品卡片 */
.product-card {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  margin-bottom: 10px;
  padding: 12px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.product-image {
  width: 48px;
  height: 48px;
  background: var(--bg-gray);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.product-emoji {
  font-size: 24px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.product-desc {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 4px;
}

.product-price {
  display: flex;
  align-items: center;
}

.price-amount {
  font-weight: 600;
  color: var(--accent);
  font-size: 13px;
}

.buy-button {
  background: var(--primary);
  padding: 8px 14px;
  border-radius: var(--radius-md);
}

.buy-text {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

/* 弹窗 */
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
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 20px;
  width: 85%;
  max-width: 300px;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.detail-emoji {
  font-size: 36px;
  margin-right: 12px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  color: var(--text-primary);
}

.close-btn {
  font-size: 18px;
  color: var(--text-muted);
  padding: 4px;
}

.detail-description {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 12px;
  display: block;
}

.detail-effect {
  background: var(--bg-gray);
  padding: 10px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
}

.effect-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
}

.effect-desc {
  color: var(--text-secondary);
  font-size: 12px;
}

.detail-price {
  text-align: center;
  margin-bottom: 16px;
}

.detail-buttons {
  display: flex;
  gap: 10px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius-md);
  font-weight: 500;
  border: none;
  font-size: 13px;
}

.cancel-btn {
  background: var(--bg-gray);
  color: var(--text-secondary);
}

.confirm-btn {
  background: var(--primary);
  color: #fff;
}
</style>
