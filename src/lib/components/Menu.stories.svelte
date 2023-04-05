<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Menu from './Menu.svelte';
</script>

<Meta title="Menu" component={Menu} />

<Template let:args>
	<Menu {...args} menuItems={[{ label: 'ToDo', selected: true }, { label: 'Done' }]} />
</Template>

<Story name="Default" />

<Story name="With title" args={{ title: 'Tasks' }} />
