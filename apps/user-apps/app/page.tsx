import { CardWithForm } from "./demo";
import { PrismaClient } from "@repo/db/client";
const client = new PrismaClient();
export default function Page() {
  return (
    <main className="m-auto">
      <CardWithForm />
      <h1> This is user app</h1>
    </main>
  );
}
