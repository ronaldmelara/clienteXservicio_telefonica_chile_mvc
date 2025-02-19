namespace ClienteServicio.mappers
{
    public class CustomerViewModel
    {
        public int rut { get; set; }
        public string dv { get; set; }
        public string customer { get; set; }

        public string rutdv
        {
            get
            {
                return rut.ToString() + "-" + dv;
            }
        }
    }
}
