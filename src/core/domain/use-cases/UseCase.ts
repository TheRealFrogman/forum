export abstract class UseCase {
   canDo(..._args: any[]): boolean {
      throw new Error("Not implemented");
   }
   abstract execute(...args: any[]): Promise<any>
}