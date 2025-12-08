import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialdata = {
  columns: [
    { id: "1", title: "To Do", cardIds: ["1", "2"] },
    { id: "2", title: "In Progress", cardIds: ["3"] },
    { id: "3", title: "Done", cardIds: ["4", "5"] },
  ],
  cards: [
    { id: "1", content: "Task 1" },
    { id: "2", content: "Task 2" },
    { id: "3", content: "Task 3" },
    { id: "4", content: "Task 4" },
    { id: "5", content: "Task 5" },
  ],
};

export default function Board() {
  const [data, setData] = useState(initialdata);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = data.columns.find(
      (col) => col.id === source.droppableId
    );

    const finishColumn = data.columns.find(
      (col) => col.id === destination.droppableId
    );

    const sourceCardIds = Array.from(startColumn.cardIds);
    sourceCardIds.splice(source.index, 1);

    const destCardIds = Array.from(finishColumn.cardIds);
    destCardIds.splice(destination.index, 0, draggableId);

    const newColumns = data.columns.map((col) => {
      if (col.id === startColumn.id) return { ...col, cardIds: sourceCardIds };
      if (col.id === finishColumn.id) return { ...col, cardIds: destCardIds };
      return col;
    });

    setData({ ...data, columns: newColumns });
  };

  return (
    <div className="flex p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {data.columns.map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col w-[350px] p-4 m-2 border rounded-lg border-slate-200 min-h-[250px]"
              >
                <div className="sticky flex items-center justify-between">
                  <h2 className="mb-3 text-lg font-bold">{column.title}</h2>
                  <button
                    className="float-right text-xs text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();

                      setData((prev) => ({
                        ...prev,

                        columns: prev.columns.filter(
                          (col) => col.id !== column.id
                        ),

                        cards: prev.cards.filter(
                          (c) => !column.cardIds.includes(c.id)
                        ),
                      }));
                    }}
                  >
                    ✕
                  </button>
                </div>

                {column.cardIds.map((cardId, index) => {
                  const card = data.cards.find((c) => c.id === cardId);

                  return (
                    <Draggable draggableId={cardId} index={index} key={cardId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="items-center justify-center p-2 mb-2 bg-white border rounded-lg cursor-pointer border-slate-200 hover:bg-slate-100"
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          {card?.content}
                          <button
                            className="float-right text-xs text-red-500"
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                columns: prev.columns.map((col) => ({
                                  ...col,
                                  cardIds: col.cardIds.filter(
                                    (id) => id !== cardId
                                  ),
                                })),
                                cards: prev.cards.filter(
                                  (c) => c.id !== cardId
                                ),
                              }));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {snapshot.isDraggingOver && provided.placeholder}

                <button
                  className="p-1 mb-3 text-sm rounded bg-slate-100 "
                  onClick={() => {
                    const content = prompt("Neue Karte eingeben:");
                    if (!content) return;

                    const newId = Date.now().toString();

                    setData((prev) => ({
                      ...prev,
                      cards: [...prev.cards, { id: newId, content }],
                      columns: prev.columns.map((col) =>
                        col.id === column.id
                          ? { ...col, cardIds: [...col.cardIds, newId] }
                          : col
                      ),
                    }));
                  }}
                >
                  + Karte hinzufügen
                </button>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      <button
        className="w-32 p-2 m-2 border rounded border-slate-200 min-w-32 "
        onClick={() => {
          const title = prompt("Name der neuen Spalte:");
          if (!title) return;

          const newId = Date.now().toString();

          setData((prev) => ({
            ...prev,
            columns: [...prev.columns, { id: newId, title, cardIds: [] }],
          }));
        }}
      >
        + Neue Spalte
      </button>
    </div>
  );
}
