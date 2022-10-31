import Data.Char

count :: (a -> Bool) -> [a] -> Int

count f = foldr(\a res ->
    if f a
        then res + 1
        else res
    )
    0

countHelper f n = True



--calculatePoints a 
  --      | a == [] = 0
    --    | tail a == [] = evaluateResult(head a)
      --  | otherwise = evaluateResult(head a) + calculatePoints(tail a)
-- TESZTEK:
--count even [1..10] == 5
--count odd [1..10] == 5
--count (\ x -> x * 2 == x + 2) [1..10] == 1