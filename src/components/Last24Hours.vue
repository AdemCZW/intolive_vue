<template>
  <div class="container mt-4">
        <table class="table table-striped table-borderless">
            <thead>
                <tr style="color: azure;">
                    <th>Name</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="ingredientLast24Hour in ingredientsLast24Hours" :key="ingredientLast24Hour.id" class="table-row" :class="getColorClass(ingredientLast24Hour.color)">
                    <td>{{ ingredientLast24Hour.name }}</td>
                    <td>{{ ingredientLast24Hour.color }}</td>
                    <td>{{ ingredientLast24Hour.size }}</td>
                    <td>{{ ingredientLast24Hour.quantity }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { useQuery } from '@vue/apollo-composable'
import { ref } from 'vue'
import gql from 'graphql-tag'

const GET_INGREDIENTS_LAST_24_HOURS = gql`
  query {
    allIngredients {
      id
    }
    totalLast24Hours
    ingredientsLast24Hours {
      name
      size
      color
      quantity
      createdAt
    }
  }
`

const { onResult, loading, error } = useQuery(GET_INGREDIENTS_LAST_24_HOURS)
const ingredientsLast24Hours = ref([])

onResult(({ data }) => {
  console.log('Query result (last 24 hours):', data)
  
  if (data) {
    const now = new Date()
    const filteredIngredients = data.ingredientsLast24Hours.filter(ingredient => {
      const ingredientDate = new Date(ingredient.createdAt)
      const diffInHours = (now - ingredientDate) / 1000 / 60 / 60
      return diffInHours <= 24
    })

    const aggregatedIngredients = filteredIngredients.reduce((acc, curr) => {
      const existingIngredientIndex = acc.findIndex(ingredient => ingredient.name === curr.name && ingredient.color === curr.color && ingredient.size === curr.size)
      if (existingIngredientIndex !== -1) {
        const existingIngredient = acc[existingIngredientIndex]
        acc[existingIngredientIndex] = { ...existingIngredient, quantity: existingIngredient.quantity + curr.quantity }
      } else {
        acc.push(curr)
      }
      return acc
    }, [])

    ingredientsLast24Hours.value = aggregatedIngredients.sort((a, b) => {
      if (a.color === b.color) {
        return a.size - b.size
      }
      return a.color > b.color ? 1 : -1
    })
  } else {
    ingredientsLast24Hours.value = []
  }
})

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
</script>
<style>
.text-white {
  color: #fff !important;
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

.table-row td {
    border-top: none;
    border-bottom: none;
}
</style>