import test from 'ava';
test(t => {
	 t.is("\nfoo\n\nbar\n","\nfoo\n\nbar\n")
});
test(t => {
	 var model = {title:"foo"}
	 t.deepEqual({title:"foo"},model)
});