serve:
	yarn tsc index.ts
	yarn tsc public\index.ts
	lessc public\style.less public\style.css
	npm start