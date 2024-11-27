interface CategoryProps {
   id: string;
   name: string;
}

interface CategoryInitializer extends CategoryProps { }

export class Category implements CategoryProps {
   id!: string;
   name!: string;

   constructor(data: CategoryInitializer) {
      if (data) {
         this.id = data.id;
         this.name = data.name;
      }
   }

   static schema = {
      title: "Category",
      type: "object",
      properties: {
         id: {
            type: "string",
            minLength: 0,
            "pattern": "[0-9]+"
         },
         name: {
            type: "string",
            minLength: 3,
            maxLength: 20
         }
      },
      required: ["id", "name"],
      additionalProperties: false
   }
}
