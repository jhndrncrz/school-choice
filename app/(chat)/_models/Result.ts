export default interface Result extends Record<string, number> {
    extremely_considered: number, 
    high_consideration: number, 
    moderate_consideration: number,
    slight_consideration: number , 
    neutral: number, 
    not_at_all_considered: number, 
    did_not_consider: number
}