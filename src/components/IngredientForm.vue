<template>
  <div class="container mt-4">
    <div class="ingredient-form">
      <form @submit.prevent="submitForm" class="p-3">
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
    </div>
  </div>
</template>

<style scoped>
.ingredient-form {
    background-color: transparent;
}

.btn-primary {
    background-color: #333;
    color: #fff;
}
</style>
<script setup>
import { reactive } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const ADD_INGREDIENT_MUTATION = gql`
  mutation ingredient($name: String!, $notes: String, $size: String!, $quantity: Int!, $color: String!) {
    createIngredient(name: $name, notes: $notes, size: $size, quantity: $quantity, color: $color) {
      ingredient {
        id
        name
        notes
        size
        quantity
        color
      }
    }
  }
`
const GET_INGREDIENTS_QUERY = gql`
  query {
    allIngredients {
      id
      name
      notes
      size
      quantity
      color
      shipped
      createdAt
    }
  }
`

const { mutate: ingredient } = useMutation(ADD_INGREDIENT_MUTATION)
const { refetch } = useQuery(GET_INGREDIENTS_QUERY)
const form = reactive({
  name: '',
  notes: '',
  size: '',
  quantity: 1,
  color: ''
})

const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const colors = [
  { value: 'BLK', label: 'Black' },
  { value: 'CRM', label: 'Cream' },
  { value: 'OAT', label: 'Oatmeal' },
  { value: 'CML', label: 'Camel' },
  { value: 'BRN', label: 'Brown' }
]

const submitForm = async () => {
  await ingredient({
    name: form.name,
    notes: form.notes,
    size: form.size,
    quantity: parseInt(form.quantity),
    color: form.color
  })

  // 重新獲取數據
  await refetch()
}

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