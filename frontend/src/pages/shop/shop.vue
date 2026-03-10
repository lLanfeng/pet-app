<template>
  <div class="shop-container">
    <!-- 商店头部 -->
    <div class="shop-header">
      <span class="shop-title">宠物商店</span>
      <div class="coin-display">
        <span class="coin-icon">💰</span>
        <span class="coin-amount">{{ userCoins }}</span>
      </div>
    </div>

    <!-- 商品分类 -->
    <div class="category-tabs">
      <div
        v-for="category in displayCategories"
        :key="category.id"
        class="category-tab"
        :class="{ active: activeCategory === category.id }"
        @click="switchCategory(category.id)"
      >
        <span class="category-icon">{{ category.icon }}</span>
        <span class="category-name">{{ category.name }}</span>
      </div>
    </div>

    <!-- 商品列表 -->
    <div v-if="activeCategory !== 'inventory'" class="products-list">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="'category-' + product.category"
        @click="showProductDetail(product)"
      >
        <div class="product-image">
          <span class="product-emoji">{{ product.emoji }}</span>
        </div>
        <div class="product-info">
          <span class="product-name">{{ product.name }}</span>
          <span class="product-desc">{{ product.description }}</span>
          <div class="product-price">
            <span class="price-icon">💰</span>
            <span class="price-amount">{{ product.price }}</span>
          </div>
        </div>
        <div class="buy-button" @click.stop="buyProduct(product)">
          <span class="buy-text">购买</span>
        </div>
      </div>
    </div>

    <!-- 背包 -->
    <div v-else class="products-list">
      <div class="inventory-header">
        <span class="inventory-title">我的背包</span>
      </div>
      <div v-if="inventory.length === 0" class="empty-inventory">
        <span class="empty-emoji">🎒</span>
        <span class="empty-text">背包空空如也</span>
      </div>
      <div
        v-for="item in inventory"
        :key="item.id"
        class="product-card"
        :class="'category-' + item.category"
      >
        <div class="product-image">
          <span class="product-emoji">{{ item.emoji }}</span>
        </div>
        <div class="product-info">
          <span class="product-name">{{ item.name }}</span>
          <span class="product-desc">{{ item.effect }}</span>
          <div class="product-price">
            <span class="price-amount">x{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品详情弹窗 -->
    <div v-if="showDetail" class="detail-modal" @click="hideDetail">
      <div class="detail-content" @click.stop>
        <div class="detail-header">
          <div class="detail-emoji-wrap">
            <span class="detail-emoji">{{ selectedProduct?.emoji }}</span>
          </div>
          <div class="detail-info">
            <span class="detail-name">{{ selectedProduct?.name }}</span>
            <div class="close-btn" @click="hideDetail">✕</div>
          </div>
        </div>
        <span class="detail-description">{{ selectedProduct?.description }}</span>
        <div class="detail-effect">
          <span class="effect-title">效果：</span>
          <span class="effect-desc">{{ selectedProduct?.effect }}</span>
        </div>
        <div class="detail-price">
          <span class="price-icon">💰</span>
          <span class="price-value">{{ selectedProduct?.price }}</span>
        </div>
        <div class="detail-buttons">
          <button class="cancel-btn" @click="hideDetail">取消</button>
          <button class="confirm-btn" @click="confirmBuy">确认购买</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { shopAPI } from '@/services/api'

const categories = ref<any[]>([])
const products = ref<any[]>([])
const inventory = ref<any[]>([])
const authStore = useAuthStore()
const activeCategory = ref('food')
const showDetail = ref(false)
const selectedProduct = ref<any>(null)
const userCoins = computed(() => authStore.userInfo?.coins ?? 0)

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
  padding-bottom: 80px;
}

/* 头部 */
.shop-header {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: 50px 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.coin-display {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.coin-icon {
  font-size: 16px;
  margin-right: 4px;
}

.coin-amount {
  font-weight: 700;
  color: #fff;
  font-size: 14px;
}

/* 分类 */
.category-tabs {
  display: flex;
  padding: 16px;
  gap: 10px;
  overflow-x: auto;
  background: var(--bg-page);
}

.category-tab {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-full);
  white-space: nowrap;
  transition: all 0.3s ease;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.category-tab:hover {
  transform: translateY(-2px);
}

.category-tab.active {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  border-color: transparent;
  transform: scale(1.05);
}

.category-icon {
  font-size: 16px;
  margin-right: 6px;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
}

.category-tab.active .category-name {
  color: #fff;
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
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s ease;
}

.product-card:active {
  transform: scale(0.98);
}

.product-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.category-food .product-image { background: #FEF3C7; }
.category-toy .product-image { background: #DBEAFE; }
.category-medicine .product-image { background: #FCE7F3; }
.category-decoration .product-image { background: #E0E7FF; }

.product-emoji {
  font-size: 28px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  display: block;
  margin-bottom: 2px;
}

.product-desc {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}

.product-price {
  display: flex;
  align-items: center;
}

.price-icon {
  font-size: 12px;
  margin-right: 2px;
}

.price-amount {
  font-weight: 700;
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
}

.buy-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  padding: 10px 18px;
  border-radius: var(--radius-full);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
}

.buy-text {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}

/* 弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-content {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 24px;
  width: 85%;
  max-width: 320px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.detail-emoji-wrap {
  width: 72px;
  height: 72px;
  background: var(--bg-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
}

.detail-emoji {
  font-size: 40px;
}

.detail-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.detail-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  font-size: 18px;
  color: var(--text-muted);
  padding: 4px;
  cursor: pointer;
}

.detail-description {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
  display: block;
  line-height: 1.5;
}

.detail-effect {
  background: var(--bg-gray);
  padding: 12px;
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

.effect-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 13px;
}

.effect-desc {
  color: var(--primary);
  font-size: 13px;
}

.detail-price {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.detail-price .price-icon {
  font-size: 18px;
  margin-right: 4px;
}

.price-value {
  font-weight: 700;
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 24px;
}

.detail-buttons {
  display: flex;
  gap: 12px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 14px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  border: none;
  font-size: 14px;
}

.cancel-btn {
  background: var(--bg-gray);
  color: var(--text-secondary);
}

.confirm-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
</style>
