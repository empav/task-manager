import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import UpsertTaskModal from "./UpsertTaskModal";

describe("UpsertTaskModal", () => {
  it("matches snapshot", () => {
    const html = renderToStaticMarkup(
      <UpsertTaskModal
        open={true}
        isLoading={false}
        onCancel={() => {}}
        onSubmit={() => {}}
        initialValues={{ title: "Write tests", description: "Snapshots" }}
      />,
    );

    expect(html).toMatchSnapshot();
  });
});
