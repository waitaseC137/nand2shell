"""16–17 · Birim gecikmeli kapı simülatörü (sr_latch_16.py, d_latch_17.py ve reset_latch_17.py'nin ortak parçası).

Her kapının çıkışı t+1 anında, t anındaki girişlerinden hesaplanır. Böylece döngülü
devrelerde titreme (salınım) ve bir anlık iğneler görünür hâle gelir. Gerçek bir
çipte gecikmeler eşit değildir; eşit olmayan gecikmeler için verilog/ klasörüne bak.
Tek başına çalıştırılmaz, öbür dosyalar içe aktarır.
"""
NAND = lambda a, b: 0 if (a and b) else 1
NAND3 = lambda a, b, c: 0 if (a and b and c) else 1
AND = lambda a, b: 1 if (a and b) else 0
OR = lambda a, b: 1 if (a or b) else 0
INV = lambda a: 0 if a else 1

def run(gates, state, inputs_seq, out):
    """gates: {ad: (fonksiyon, [giriş adları])} · state: başlangıç değerleri
    inputs_seq: [(değişen girişler dict, kaç tik)] · out: izlenecek tel. (son durum, çıkışın tik tik izi) döner."""
    st = dict(state); trace = []
    for inp, n in inputs_seq:
        st.update(inp)
        for _ in range(n):
            new = dict(st)
            for g, (f, ins) in gates.items():
                new[g] = f(*[st[i] for i in ins])
            st = new; trace.append(st[out])
    return st, trace

def settled(trace, k=4):
    """Son k tik aynıysa o değer, değilse 'SALINIYOR'."""
    t = trace[-k:]
    return t[0] if len(set(t)) == 1 else 'SALINIYOR'

def settle(gates, inp, out, tik=20):
    """Bütün teller 0'dan başlayıp verilen girişlerle oturduktan sonraki durum."""
    st = {k: 0 for k in gates}; st.update(inp)
    st, _ = run(gates, st, [(inp, tik)], out)
    return st
