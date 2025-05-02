import { Header } from "components";
import { ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";
import { ColumnsDirective } from "@syncfusion/ej2-react-charts";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/admin-layout";

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);

  return { users, total };
}

const AllUsers = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access detailed user profiles."
      />

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width={150}
            textAlign="Left"
            template={(props: UserData) => (
              <div className="flex items-center ga-1.5 px-4">
                <img
                  src={props.imageUrl}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                />
                <span>{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width={200}
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width={120}
            textAlign="Left"
            template={({joinedAt} : { joinedAt: string }) => formatDate(joinedAt)}
          />
          {/* <ColumnDirective
            field="itineraryCreated"
            headerText="Trip Created"
            width={130}
            textAlign="Left"
          /> */}
          <ColumnDirective
            field="status"
            headerText="Type"
            width={150}
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-100"
                )}
              >
                <div>
                  <h3
                    className={cn(
                      "font-inter text-xs font-medium",
                      status === "user" ? "text-success-700" : "text-gray-500"
                    )}
                  >
                    {status}
                  </h3>
                </div>
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500"
                  )}
                ></div>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default AllUsers;
