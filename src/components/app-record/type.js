const type = {
    requirement: "requirement",
    knowledge: "knowledge",
    solution: "solution",
    note: "note",
}

const CreationType = {
    requirement: "requirement",
    knowledge: "knowledge",
    solution: "solution",
    note: "note",
}

const DetailType = {
    knowledge: "knowledge"
}

const types = ["requirement", "knowledge", "solution"]
const type_ = {}
types.map(t => {
    type_[[t]] = t
})

export { CreationType, DetailType }
export default type;