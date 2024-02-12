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
                <tr v-for="allPickUp in allPickUps" :key="allPickUp.id" class="table-row" :class="getColorClass(allPickUp.color)">
                    <td>{{ allPickUp.name }}</td>
                    <td>{{ allPickUp.color }}</td>
                    <td>{{ allPickUp.size }}</td>
                    <td>{{ allPickUp.quantity }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

const GET_PICK_UPS = gql`
  query {
    allPickUps {
      id
      name
      size
      color
      quantity
      createdAt
    }
  }
`

const { onResult } = useQuery(GET_PICK_UPS)
const allPickUps = ref([])

onResult(({ data }) => {
    console.log('Query result (pick ups):', data)
    
    if (data) {
        const now = new Date()
        allPickUps.value = data.allPickUps.filter(pickUp => {
            const pickUpDate = new Date(pickUp.createdAt)
            const diffInHours = (now - pickUpDate) / 1000 / 60 / 60
            return diffInHours <= 24
        })
    } else {
        allPickUps.value = []
    }
    
    return allPickUps
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