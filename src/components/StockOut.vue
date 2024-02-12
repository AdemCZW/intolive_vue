<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">
                <!-- Nav tabs -->
                <nav>
                    <div class="nav nav-tabs border-0" id="nav-tab" role="tablist">
                        <button class="nav-link text-light" :class="{ 'active border': currentTab === name }" v-for="(group, name, index) in groupedIngredients" :key="name" :id="`${name}-tab`" data-bs-toggle="tab" :data-bs-target="`#${name}`" type="button" role="tab" :aria-controls="name" :aria-selected="currentTab === name" @click="currentTab = name">{{ name }}</button>
                    </div>
                </nav>
                <!-- Tab panes -->
                <div class="tab-content" id="nav-tabContent">
                    <transition-group name="slide" appear>
                        <div class="tab-pane fade" :class="{ 'show': index === 0, 'active': index === 0 }" v-for="(group, name, index) in groupedIngredients" :key="name" :id="name" role="tabpanel" :aria-labelledby="`${name}-tab`" tabindex="0">
                            <table class="table table-striped">
                                <thead class="thead-dark">
                                    <tr style="color: azure;">
                                        <th scope="col">Size</th>
                                        <th scope="col">Color</th>
                                        <th scope="col">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="ingredient in group" :key="ingredient.id" class="table-row" :class="getColorClass(ingredient.color)">
                                        <td>{{ ingredient.size }}</td>
                                        <td>{{ ingredient.color }}</td>
                                        <td>{{ ingredient.quantity }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition-group>
                </div>
            </div>

            <div class="col-md-6">
                <h4>選擇上架的物件跟數量</h4>
                <!-- Form -->
                <form @submit.prevent="stockForm">
                    <div class="mb-3">
                        <label class="form-label">Name</label>
                        <input v-model="form.name" placeholder="Name" required class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Size</label>
                        <select v-model="form.size" required class="form-control">
                            <option disabled value="">Please select a size</option>
                            <option v-for="size in sizes" :key="size">{{ size }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Color</label>
                        <select v-model="form.color" required class="form-control">
                            <option disabled value="">Please select a color</option>
                            <option v-for="color in colors" :key="color.value" :value="color.value">{{ color.label }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Quantity</label>
                        <input v-model="form.quantity" placeholder="Quantity" type="number" required class="form-control" />
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
                <p>＊如果減去過多數量，從下面退貨表格再輸入同品項數量即可</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {

}

.card {
        background-color: #444;
        border-color: #666;
        border-radius: 10px;
}

.thead-dark {
        background-color: #555;
        border-bottom-color: #666;
}

.table-row {
        background-color: #444;
}

.btn-primary {
    background-color: #333;
}

.table-row:hover {
        background-color: #f8f9fa;
}

.text-white {
    color: #fff !important;
}

.table-row td {
    border-top: none;
    border-bottom: none;
}
.bg-crm {
    background-color: #fff8da !important; /* Cream */
}

.bg-oat {
    background-color: #f5deb3 !important; /* Oat */
}

.bg-cml {
    background-color: #c19a6b !important; /* Camel */
}

.bg-brn {
    background-color: #964b00 !important; /* Brown */
}
.nav-link.active {
    background-color: transparent !important;
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slide-out {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

</style>
<script setup>
import { ref, computed, reactive, watchEffect, watch, onMounted } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

const { result: ingredientsResult, loading: ingredientsLoading, error: ingredientsError, refetch: refetchIngredients } = useQuery(
    gql`
        query {
            allIngredients {
                id
                name
                size
                color
                quantity
                createdAt
            }
        }
    `
)

const { result: intoStocksResult, refetch: refetchIntoStocks } = useQuery(
    gql`
        query {
            allIntoStocks {
                id
                name
                size
                color
                quantity
                createdAt
            }
        }
    `
)

const ADD_INTO_STOCK_MUTATION = gql`
  mutation intoStock($name: String!, $size: String!, $color: String!, $quantity: Int!) {
    createIntoStock(name: $name, size: $size, color: $color, quantity: $quantity) {
      intoStock {
        id
        name
        size
        color
        quantity
      }
    }
  }
`

onMounted(() => {
    var tabs = new bootstrap.Tab(document.querySelector('#nav-tab'))

    function updateTabBorders() {
        document.querySelectorAll('#nav-tab .nav-link').forEach(function (navLink) {
            if (navLink.classList.contains('active')) {
                // 將活動標籤的邊框設為米白色
                navLink.style.border = '1px solid #f5f5dc';
            } else {
                // 移除非活動標籤的邊框
                navLink.style.border = '0';
            }
        });
    }

    document.querySelector('#nav-tab').addEventListener('shown.bs.tab', function (event) {
        updateTabBorders();
    })

    document.querySelector('#nav-tab').addEventListener('hidden.bs.tab', function (event) {
        updateTabBorders();
    })

    // 初始設定邊框
    updateTabBorders();
});

    const adjustedIngredients = computed(() => {
    if (!ingredientsResult.value || !intoStocksResult.value) {
        return []
    }

    // 先創建一個對象，將相同類型的成分相加
    const ingredientsMap = ingredientsResult.value.allIngredients.reduce((acc, ingredient) => {
        const key = `${ingredient.name}-${ingredient.size}-${ingredient.color}`

        if (acc[key]) {
            acc[key].quantity += ingredient.quantity
        } else {
            acc[key] = { ...ingredient }
        }

        return acc
    }, {})

    // 創建一個對象，將相同類型的入庫數量相加
    const intoStocksMap = intoStocksResult.value.allIntoStocks.reduce((acc, intoStock) => {
        const key = `${intoStock.name}-${intoStock.size}-${intoStock.color}`

        if (acc[key]) {
            acc[key].quantity += intoStock.quantity
        } else {
            acc[key] = { ...intoStock }
        }

        return acc
    }, {})

    // 然後將對象轉換為數組
    let ingredientsArray = Object.values(ingredientsMap)

    // 將成分數量與入庫數量進行比較
    ingredientsArray = ingredientsArray.map(ingredient => {
        const key = `${ingredient.name}-${ingredient.size}-${ingredient.color}`
        const intoStock = intoStocksMap[key]

        return {
            ...ingredient,
            quantity: ingredient.quantity - (intoStock ? intoStock.quantity : 0)
        }
    })

    
    // 在返回數組之前，對數組進行排序
    return ingredientsArray.sort((a, b) => {
        // 先按名稱排序
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;

        // 如果名稱相同，則按顏色排序
        if (a.color < b.color) return -1;
        if (a.color > b.color) return 1;

        // 如果名稱和顏色都相同，則按尺寸排序
        const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL','XXXL']; // 你的尺寸順序可能需要調整
        const aSizeIndex = sizeOrder.indexOf(a.size);
        const bSizeIndex = sizeOrder.indexOf(b.size);

        if (aSizeIndex < bSizeIndex) return -1;
        if (aSizeIndex > bSizeIndex) return 1;

        return 0;
    });
})


const form = reactive({
  name: '',
  notes: '',
  size: '',
  quantity: 1,
  color: ''
})

const { mutate: intoStock } = useMutation(ADD_INTO_STOCK_MUTATION)

const stockForm = async () => {
    watchEffect(() => {
        console.log('Form data changed:', form)
    })

    await intoStock({
        name: form.name,
        size: form.size,
        color: form.color,
        quantity: parseInt(form.quantity)
    })

    // 數據成功提交後，重新獲取庫存數據
    await refetchIngredients()
    await refetchIntoStocks()
}

const groupedIngredients = computed(() => {
    return adjustedIngredients.value.reduce((groups, ingredient) => {
        const key = ingredient.name;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(ingredient);
        return groups;
    }, {});
});

watch(() => form.name, async (newName) => {
    // 在這裡，你可以根據新的 `name` 來更新你的表格數據
    // 例如，你可能需要重新獲取與 `newName` 相關的成分或庫存數據
    await refetchIngredients(newName)
    await refetchIntoStocks(newName)
})

const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const colors = [
  { value: 'BLK', label: 'Black' },
  { value: 'CRM', label: 'Cream' },
  { value: 'OAT', label: 'Oatmeal' },
  { value: 'CML', label: 'Camel' },
  { value: 'BRN', label: 'Brown' }
]

const getColorClass = (color) => {
  switch (color) {
    case 'BLK':
      return 'bg-dark text-white'
    case 'CRM':
      return 'bg-crm text-black'
    case 'OAT':
      return 'bg-oat text-black'
    case 'CML':
      return 'bg-cml text-white'
    case 'BRN':
      return 'bg-brn text-white'
    default:
      return ''
  }
}

let currentTab = ref(null)

watchEffect(() => {
    if (groupedIngredients.value && Object.keys(groupedIngredients.value).length > 0) {
        currentTab.value = Object.keys(groupedIngredients.value)[0]
    }
})

</script>