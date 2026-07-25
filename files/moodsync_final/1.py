def rabin_karp(text, pattern, q):
    d = 10
    m = len(pattern)
    n = len(text)

    p = 0
    t = 0
    h = 1

    for i in range(m-1):
        h = (h * d) % q

    for i in range(m):
        p = (d*p + int(pattern[i])) % q
        t = (d*t + int(text[i])) % q

    for i in range(n-m+1):

        if p == t:
            match = True
            for j in range(m):
                if text[i+j] != pattern[j]:
                    match = False
                    break
            if match:
                print("Pattern found at index", i)

        if i < n-m:
            t = (d*(t-int(text[i])*h) + int(text[i+m])) % q

            if t < 0:
                t = t + q


text = "9272183057121219362397"
pattern = "21936"
q = 21

rabin_karp(text, pattern, q)