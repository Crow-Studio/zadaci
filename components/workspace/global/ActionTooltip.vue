<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'

interface ActionTootipProps {
  label?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

const _props = withDefaults(defineProps<ActionTootipProps>(), {
  align: 'center',
  side: 'bottom',
  label: '',
})
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        :side="side"
        :align="align"
      >
        <p>{{ label }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
